import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  Server,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Code,
  Key,
  Save,
  Check,
  Zap,
  Radio
} from 'lucide-react';
import {
  checkApiHealth,
  HealthCheckResult,
  getStoredLTAKey,
  getStoredOneMapKey,
  saveApiKeys,
  getKeysStatus
} from '../services/ltaOneMapService';

interface ApiHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysUpdated?: () => void;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({
  isOpen,
  onClose,
  onKeysUpdated
}) => {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [inputLtaKey, setInputLtaKey] = useState<string>('');
  const [inputOneMapKey, setInputOneMapKey] = useState<string>('');

  const [activeEndpointData, setActiveEndpointData] = useState<{ path: string; data: any } | null>(null);
  const [endpointLoading, setEndpointLoading] = useState(false);

  const loadHealthAndKeys = async () => {
    setLoading(true);
    const data = await checkApiHealth();
    setHealth(data);

    // Populate current keys
    const storedLta = getStoredLTAKey();
    const storedOneMap = getStoredOneMapKey();
    if (storedLta) setInputLtaKey(storedLta);
    if (storedOneMap) setInputOneMapKey(storedOneMap);

    const serverKeys = await getKeysStatus();
    if (serverKeys && !storedLta && serverKeys.hasLTAKey) {
      setInputLtaKey(serverKeys.ltaKeyMasked);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadHealthAndKeys();
      setSaveSuccessMsg(null);
    }
  }, [isOpen]);

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKeys(true);
    setSaveSuccessMsg(null);

    const result = await saveApiKeys(inputLtaKey, inputOneMapKey);
    await loadHealthAndKeys();

    if (result?.probe?.tested) {
      if (result.probe.success) {
        setSaveSuccessMsg(`Success: ${result.probe.message}`);
      } else {
        setSaveSuccessMsg(`Probe result: ${result.probe.message}`);
      }
    } else {
      setSaveSuccessMsg('Keys saved successfully! Testing endpoints...');
    }

    if (onKeysUpdated) {
      onKeysUpdated();
    }
    setSavingKeys(false);
  };

  const testEndpoint = async (path: string) => {
    setEndpointLoading(true);
    try {
      const ltaKey = getStoredLTAKey();
      const query = ltaKey ? `?accountKey=${encodeURIComponent(ltaKey)}` : '';
      const res = await fetch(`${path}${query}`);
      const json = await res.json();
      setActiveEndpointData({ path, data: json });
    } catch (err: any) {
      setActiveEndpointData({ path, data: { error: err.message } });
    }
    setEndpointLoading(false);
  };

  if (!isOpen) return null;

  const isLive = Boolean(health?.liveDataStreaming);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] text-white border border-[#334155] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${isLive ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  API Diagnostics & Live Stream Health
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isLive ? 'bg-[#065f46] text-[#6ee7b7]' : 'bg-[#78350f] text-[#fde68a]'
                }`}>
                  {isLive ? '● Live Stream Connected' : '○ Simulation Fallback'}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Real-time status of LTA DataMall v2 and Singapore OneMap endpoints
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadHealthAndKeys}
              disabled={loading}
              className={`p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#334155] rounded transition-all cursor-pointer ${
                loading ? 'animate-spin' : ''
              }`}
              title="Refresh Health"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#ef4444] rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Key Configuration Form */}
          <div className="bg-[#1e293b] p-4 rounded-xl border border-[#334155] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <Key className="w-4 h-4 text-[#f59e0b]" />
                <span>Configure Live API Credentials</span>
              </div>
              <span className="text-[11px] text-[#94a3b8]">
                Saved keys persist locally and in runtime
              </span>
            </div>

            <form onSubmit={handleSaveAndTest} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* LTA AccountKey Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                    LTA_ACCOUNT_KEY (DataMall Key):
                  </label>
                  <input
                    type="password"
                    value={inputLtaKey}
                    onChange={(e) => setInputLtaKey(e.target.value)}
                    placeholder="e.g. 5xG7mK9pL2vR..."
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] focus:border-[#2563eb] rounded-lg text-xs font-mono text-white placeholder-[#64748b] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#64748b] mt-1 block">
                    Header: <code className="text-[#93c5fd]">AccountKey</code>
                  </span>
                </div>

                {/* OneMap AccountKey Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#cbd5e1] mb-1">
                    ONEMAP_ACCOUNT_KEY (Routing Token):
                  </label>
                  <input
                    type="password"
                    value={inputOneMapKey}
                    onChange={(e) => setInputOneMapKey(e.target.value)}
                    placeholder="e.g. eyJhbGciOi..."
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] focus:border-[#2563eb] rounded-lg text-xs font-mono text-white placeholder-[#64748b] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#64748b] mt-1 block">
                    Header: <code className="text-[#93c5fd]">Authorization: Bearer</code>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                <button
                  type="submit"
                  disabled={savingKeys}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKeys ? 'Testing Live Connection...' : 'Save & Verify Live Stream'}</span>
                </button>

                {saveSuccessMsg && (
                  <div className="text-[11px] font-medium text-[#10b981] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Live Stream Status Card */}
          <div className={`p-4 rounded-xl border ${
            isLive
              ? 'bg-[#064e3b]/40 border-[#059669]'
              : 'bg-[#451a03]/40 border-[#d97706]'
          } space-y-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${isLive ? 'text-[#10b981] animate-pulse' : 'text-[#f59e0b]'}`} />
                <span className="font-bold text-white text-xs">
                  {isLive ? 'Real-Time Telemetry Feed Active' : 'Simulation Fallback Mode Active'}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#cbd5e1]">
                Status: {health?.status}
              </span>
            </div>

            <p className="text-[#cbd5e1] text-xs leading-relaxed">
              {health?.ltaDataMall.probe.message || 'Connecting to LTA DataMall...'}
            </p>
          </div>

          {/* Endpoints Directory */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                Configured Endpoints Directory
              </span>
              <a
                href="/api/health"
                target="_blank"
                rel="noreferrer"
                className="text-[#60a5fa] hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>GET /api/health</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2">
              {health?.endpoints.map((ep) => (
                <div
                  key={ep.path}
                  className="bg-[#1e293b] p-3 rounded-xl border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#60a5fa] transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs">{ep.path}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                        ep.mode === 'live' ? 'bg-[#065f46] text-[#34d399]' : 'bg-[#0f172a] text-[#fcd34d]'
                      }`}>
                        {ep.mode}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#94a3b8]">{ep.description}</div>
                    <div className="text-[10px] text-[#64748b] font-mono truncate max-w-md">
                      {ep.upstream}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => testEndpoint(ep.path)}
                      disabled={endpointLoading}
                      className="px-3 py-1.5 bg-[#0f172a] hover:bg-[#2563eb] text-white border border-[#334155] hover:border-[#2563eb] rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>Test Endpoint</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Response Inspector */}
          {activeEndpointData && (
            <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#93c5fd] font-bold">
                  Response: {activeEndpointData.path}
                </span>
                <button
                  onClick={() => setActiveEndpointData(null)}
                  className="text-[#94a3b8] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <pre className="bg-[#0b1329] p-3 rounded-lg text-[11px] font-mono text-[#cbd5e1] max-h-56 overflow-y-auto border border-[#1e293b]">
                {JSON.stringify(activeEndpointData.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
