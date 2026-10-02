import React, { useState } from 'react';
import { ChevronDown, Info, Database } from 'lucide-react';

export const TopGovBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#f0f3f8] border-b border-[#e2e8f0] text-xs text-[#475569] font-sans relative z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium text-[#1e293b]">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] inline-block shrink-0"></span>
            <span>Independent Singapore Transit & Traffic Companion</span>
            <span className="hidden sm:inline text-[#94a3b8]">|</span>
            <span className="hidden sm:inline text-[#64748b]">Powered by Public Open Data APIs</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[#334155] hover:text-[#0f172a] transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded px-1 cursor-pointer"
          aria-expanded={isOpen}
        >
          <span>Non-Government Notice</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#64748b] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="bg-[#ffffff] border-b border-[#cbd5e1] shadow-sm py-4 px-4 sm:px-6 transition-all duration-200 animate-in fade-in slide-in-from-top-1">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#eff6ff] rounded-lg text-[#2563eb] shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0f172a]">Not a Singapore Government Agency Website</p>
                <p className="text-[#64748b] mt-0.5 leading-relaxed">
                  This application is an independent community project developed for drivers and commuters. It is not affiliated with, operated by, or endorsed by the Singapore Government or the Land Transport Authority (LTA).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#ecfdf5] rounded-lg text-[#059669] shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0f172a]">Public Open Data Telemetry</p>
                <p className="text-[#64748b] mt-0.5 leading-relaxed">
                  Traffic incident alerts, expressway CCTV snapshots, ERP gantry pricing, and road works are retrieved in real time using public APIs provided by LTA DataMall v2 and Singapore OneMap.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
