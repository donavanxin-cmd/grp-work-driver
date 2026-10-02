import React, { useState, useEffect } from 'react';
import { X, Activity, Server, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Code } from 'lucide-react';
import { checkApiHealth, HealthCheckResult } from '../services/ltaOneMapService';

interface ApiHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ isOpen, onClose }) => {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeEndpointData, setActiveEndpointData] = useState<{ path: string; data: any } | null>(null);
  const [endpointLoading, setEndpointLoading] = useState(false);

  const loadHealth = async () => {
    setLoading(true);
    const data = await checkApiHealth();
    setHealth(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadHealth();
    }
  }, [isOpen]);

  const testEndpoint = async (path: string) => {
    setEndpointLoading(true);
    try {
      const res = await fetch(path);
      const json = await res.json();
      setActiveEndpointData({ path, data: json });
    } catch (err: any) {
      setActiveEndpointData({ path, data: { error: err.message } });
    }
    setEndpointLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] text-white border border-[#334155] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#1e293b]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#2563eb]/20 text-[#60a5fa] rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                API Diagnostics & Health Monitor
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Real-time status of LTA DataMall v2 and Singapore OneMap endpoints
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadHealth}
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
          {/* Environment Variables Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#1e293b] p-4 rounded-xl border border-[#334155] space-y-1.5">
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                Vercel Env: LTA_ACCOUNT_KEY
              </div>
              <div className="flex items-center gap-2">
                {health?.credentials.LTA_ACCOUNT_KEY.includes('configured') && !health.credentials.LTA_ACCOUNT_KEY.includes('missing') ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    <span className="font-bold text-[#10b981]">Active & Configured</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                    <span className="font-bold text-[#f59e0b]">Pending in Vercel (Using Simulation)</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#64748b]">
                Applies to TrafficIncidents, EstTravelTimes, PubFloodAlerts, RoadWorks, and TrafficSpeedBands.
              </p>
            </div>

            <div className="bg-[#1e293b] p-4 rounded-xl border border-[#334155] space-y-1.5">
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                Vercel Env: ONEMAP_ACCOUNT_KEY
              </div>
              <div className="flex items-center gap-2">
                {health?.credentials.ONEMAP_ACCOUNT_KEY.includes('configured') && !health.credentials.ONEMAP_ACCOUNT_KEY.includes('missing') ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    <span className="font-bold text-[#10b981]">Active & Configured</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                    <span className="font-bold text-[#f59e0b]">Pending in Vercel (Using Simulation)</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#64748b]">
                Applies to OneMap public routing service /api/onemap-route.
              </p>
            </div>
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
                      <span className="text-[10px] bg-[#0f172a] px-2 py-0.5 rounded text-[#93c5fd] font-mono">
                        {ep.status}
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
            <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 space-y-2">
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
