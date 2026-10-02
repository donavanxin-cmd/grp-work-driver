import React from 'react';
import { Phone, Mail, Shield, ExternalLink, Info } from 'lucide-react';
import { NavTab } from './Navbar';

interface GovFooterProps {
  onNavClick: (tab: NavTab) => void;
}

export const GovFooter: React.FC<GovFooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-[#0b1c30] text-white border-t border-[#1e293b] font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Authority & Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-[#1e293b] border border-[#334155] rounded text-[11px] font-bold tracking-wider text-[#93c5fd] uppercase">
                Open Telemetry
              </div>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Independent Singapore Expressway & Traffic Companion
            </p>
            <div className="p-2.5 bg-[#0f172a] rounded-lg border border-[#1e293b] text-[11px] text-[#cbd5e1] space-y-1">
              <span className="font-semibold text-[#f59e0b] block flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Non-Government Disclaimer
              </span>
              <p className="text-[#94a3b8] leading-normal">
                This is an independent community project and is NOT an official Singapore Government agency website. Data is streamed via public APIs.
              </p>
            </div>
            <p className="text-[11px] text-[#64748b] leading-relaxed pt-1">
              © 2026 Civic Transit Intelligence. Powered by LTA DataMall and OneMap open APIs. Not affiliated with or endorsed by the Singapore Government.
            </p>
          </div>

          {/* Column 2: Transit Network */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
              Transit Network
            </h4>
            <ul className="space-y-2 text-[#94a3b8]">
              <li>
                <button
                  onClick={() => onNavClick('erp')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Expressway Cameras
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('planner')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Route Optimization
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('erp')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  ERP Gantry Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('closures')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Expressway Maintenance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('incidents')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  EMAS Live Bulletins
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Open Data & Resources */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
              Data Integrations
            </h4>
            <ul className="space-y-2 text-[#94a3b8]">
              <li>
                <a
                  href="https://datamall.lta.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>LTA DataMall v2 (Open Data)</span>
                  <ExternalLink className="w-3 h-3 text-[#64748b]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.onemap.gov.sg"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Singapore OneMap API</span>
                  <ExternalLink className="w-3 h-3 text-[#64748b]" />
                </a>
              </li>
              <li>
                <span className="text-[#64748b]">
                  Google Maps Calibrated Routing
                </span>
              </li>
              <li>
                <span className="text-[#64748b]">
                  EMAS Induction Sensor Telemetry
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency Roadside Assistance */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
              Roadside Emergency Contacts
            </h4>

            {/* EMAS Hotline Box */}
            <div className="bg-[#1c2442] border border-[#2d3a63] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">
                Official LTA Breakdown Hotline
              </div>
              <div className="text-base font-bold text-white font-mono">
                1800-CALL-LTA
              </div>
              <div className="text-[10px] text-[#94a3b8]">
                (1800 225 5582) · 24/7 Highway Towing
              </div>
            </div>

            <div className="space-y-1 text-[#94a3b8] text-[11px] pt-1">
              <div>Traffic Police (Emergency): <span className="text-white font-mono">6547 0000</span></div>
              <div>Official LTA Enquiries: <span className="text-[#93c5fd]">contact@lta.gov.sg</span></div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Links Bar */}
        <div className="mt-12 pt-6 border-t border-[#1e293b] flex flex-wrap items-center justify-between text-xs text-[#64748b] gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[#94a3b8] font-semibold">
              Independent Platform
            </span>
            <span className="text-[#475569]">|</span>
            <span>Open Data Architecture</span>
            <span className="text-[#475569]">|</span>
            <span>Live Incident Stream</span>
          </div>
          <div>
            Civic Transit Intelligence (Community Edition)
          </div>
        </div>
      </div>
    </footer>
  );
};
