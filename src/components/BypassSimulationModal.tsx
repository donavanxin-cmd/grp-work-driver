import React from 'react';
import { X, ArrowRight, Clock, ShieldCheck, DollarSign, Zap, CheckCircle2 } from 'lucide-react';
import { RoutePreset } from '../types/transit';

interface BypassSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset: RoutePreset;
  onApplyBypass: () => void;
  isBypassActive: boolean;
}

export const BypassSimulationModal: React.FC<BypassSimulationModalProps> = ({
  isOpen,
  onClose,
  preset,
  onApplyBypass,
  isBypassActive
}) => {
  if (!isOpen) return null;

  const bypass = preset.alternativeBypass;
  const primaryTime = preset.transitMins;
  const bypassTime = preset.transitMins - bypass.timeSavingsMinutes;
  const bypassToll = (preset.tollSGD + bypass.tollDeltaSGD).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#cbd5e1] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a] text-sm">
                Dynamic Expressway Bypass Simulation
              </h3>
              <p className="text-xs text-[#64748b]">
                Real-time alternative routing engine powered by EMAS sensor mesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94a3b8] hover:text-[#0f172a] hover:bg-[#e2e8f0] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="p-3.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl text-xs text-[#1e40af] leading-relaxed">
            <span className="font-bold">Algorithmic Recommendation:</span> {bypass.summary}
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Primary Route */}
            <div className={`p-4 rounded-xl border transition-all ${
              !isBypassActive ? 'bg-white border-[#cbd5e1] shadow-xs' : 'bg-[#f8fafc] border-[#e2e8f0] opacity-80'
            }`}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#0f172a]">Primary Corridor</span>
                <span className="text-[11px] text-[#ef4444] font-semibold">Bottleneck</span>
              </div>
              <div className="text-2xl font-bold text-[#0f172a] font-mono tabular-nums">
                {primaryTime} <span className="text-xs font-normal text-[#64748b]">mins</span>
              </div>
              <div className="mt-2 space-y-1 text-xs text-[#475569]">
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="font-medium text-[#0f172a]">{preset.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span>ERP Toll:</span>
                  <span className="font-medium text-[#0f172a]">${preset.tollSGD.toFixed(2)} SGD</span>
                </div>
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span className="font-medium text-[#0f172a] truncate max-w-[120px]">{preset.primaryCorridorText}</span>
                </div>
                <div className="flex justify-between text-[#ef4444] font-medium pt-1">
                  <span>Active Jam:</span>
                  <span>+{preset.delayMins}m Delay</span>
                </div>
              </div>
            </div>

            {/* Bypass Corridor */}
            <div className={`p-4 rounded-xl border relative transition-all ${
              isBypassActive
                ? 'bg-[#ecfdf5] border-[#10b981] shadow-sm ring-2 ring-[#10b981]/20'
                : 'bg-[#f0fdf4] border-[#86efac] shadow-xs'
            }`}>
              <div className="absolute -top-2.5 right-3 bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Saves {bypass.timeSavingsMinutes} Mins
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#065f46]">Optimized Bypass</span>
                <span className="text-[11px] text-[#059669] font-semibold">Free-Flow</span>
              </div>
              <div className="text-2xl font-bold text-[#065f46] font-mono tabular-nums">
                {bypassTime} <span className="text-xs font-normal text-[#059669]">mins</span>
              </div>
              <div className="mt-2 space-y-1 text-xs text-[#166534]">
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="font-medium text-[#065f46]">{(preset.distanceKm + 1.6).toFixed(1)} km</span>
                </div>
                <div className="flex justify-between">
                  <span>ERP Toll:</span>
                  <span className="font-medium text-[#065f46]">${bypassToll} SGD</span>
                </div>
                <div className="flex justify-between">
                  <span>Delta:</span>
                  <span className="font-medium text-[#047857]">-${Math.abs(bypass.tollDeltaSGD).toFixed(2)} Toll</span>
                </div>
                <div className="flex justify-between text-[#059669] font-semibold pt-1">
                  <span>Hazards:</span>
                  <span>0 Bottlenecks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Route Preview */}
          <div className="bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2e8f0] text-xs space-y-1.5">
            <div className="font-semibold text-[#0f172a] text-xs">Simulated Bypass Trajectory:</div>
            <p className="text-[#475569] leading-relaxed">
              {bypass.routeDescription}
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#475569] hover:text-[#0f172a] hover:bg-[#e2e8f0] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onApplyBypass();
              onClose();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isBypassActive
                ? 'bg-[#1e293b] text-white hover:bg-[#0f172a]'
                : 'bg-[#10b981] text-white hover:bg-[#059669]'
            }`}
          >
            {isBypassActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                Revert to Primary Route
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Apply Bypass on Navigation Map
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
