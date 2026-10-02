import React from 'react';
import { Construction, Calendar, AlertOctagon, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';
import { ROAD_CLOSURES } from '../data/singaporeTransitData';

export const RoadClosuresView: React.FC = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#d97706] uppercase tracking-wider">
          <Construction className="w-4 h-4 text-[#f59e0b]" />
          <span>Statutory Road Diversions & Civil Works</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight mt-1">
          Scheduled Road Closures & North-South Corridor (NSC)
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
          Comprehensive registry of active roadway engineering, expressway viaduct launches, and tunnel maintenance schedules across Singapore.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ROAD_CLOSURES.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#cbd5e1] rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2563eb] transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded">
                  {item.project}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  item.status === 'In Progress'
                    ? 'bg-[#fee2e2] text-[#991b1b]'
                    : item.status === 'Upcoming'
                    ? 'bg-[#fef3c7] text-[#92400e]'
                    : 'bg-[#f1f5f9] text-[#475569]'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="font-bold text-[#0f172a] text-sm leading-snug">
                {item.title}
              </h3>

              <div className="space-y-2 text-xs text-[#475569]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#64748b] shrink-0 mt-0.5" />
                  <span className="font-medium text-[#1e293b]">{item.expresswayOrRoad}</span>
                </div>

                <div className="flex items-start gap-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-[#ef4444] shrink-0 mt-0.5" />
                  <span>{item.impact}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#2563eb] shrink-0 mt-0.5" />
                  <span className="font-mono">{item.timing}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f1f5f9] bg-[#f8fafc] -mx-5 -mb-5 p-4 rounded-b-xl text-xs">
              <div className="font-bold text-[#0f172a] text-[11px] mb-1 flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 text-[#2563eb]" />
                Detour & Commuter Advisory:
              </div>
              <p className="text-[#475569] leading-relaxed">
                {item.detourAdvice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
