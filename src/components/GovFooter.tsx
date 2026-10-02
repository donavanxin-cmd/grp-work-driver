import React from 'react';
import { Phone, Mail, Shield, ExternalLink } from 'lucide-react';
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
                Civil Telemetry
              </div>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Operated by Land Transport Authority (LTA)
            </p>
            <p className="text-[11px] text-[#64748b] leading-relaxed pt-2">
              © 2025 Government of Singapore. Land Transport Authority. All Rights Reserved.
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
                  className="hover:text-white transition-colors text-left"
                >
                  Expressway Cameras
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('planner')}
                  className="hover:text-white transition-colors text-left"
                >
                  Route Optimization
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('erp')}
                  className="hover:text-white transition-colors text-left"
                >
                  ERP Gantry Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('closures')}
                  className="hover:text-white transition-colors text-left"
                >
                  Scheduled Closures
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('incidents')}
                  className="hover:text-white transition-colors text-left"
                >
                  EMAS Traffic Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Civil Services */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
              Civil Services
            </h4>
            <ul className="space-y-2 text-[#94a3b8]">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Vehicle Tax Calculator
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  COE Bidding Trends
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Electric Vehicle Portal
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Parking.sg Integration
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Heavy Vehicle Permits
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency & Support */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider">
              Emergency & Support
            </h4>

            {/* EMAS Hotline Box matching screenshot */}
            <div className="bg-[#1c2442] border border-[#2d3a63] rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">
                EMAS Breakdown Hotline
              </div>
              <div className="text-base font-bold text-white font-mono">
                1800-CALL-LTA
              </div>
              <div className="text-[10px] text-[#94a3b8]">
                (1800 225 5582) · 24/7 Toll-Free
              </div>
            </div>

            <div className="space-y-1 text-[#94a3b8] text-[11px] pt-1">
              <div>Traffic Police: <span className="text-white font-mono">6547 0000</span></div>
              <div>Feedback & Inquiries: <span className="text-[#93c5fd]">contact@lta.gov.sg</span></div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Links Bar matching screenshot */}
        <div className="mt-12 pt-6 border-t border-[#1e293b] flex flex-wrap items-center justify-between text-xs text-[#64748b] gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <button className="hover:text-[#94a3b8] transition-colors cursor-pointer">
              Report Vulnerability
            </button>
            <button className="hover:text-[#94a3b8] transition-colors cursor-pointer">
              Privacy Statement
            </button>
            <button className="hover:text-[#94a3b8] transition-colors cursor-pointer">
              Terms of Use
            </button>
            <button className="hover:text-[#94a3b8] transition-colors cursor-pointer">
              Rate This Service
            </button>
          </div>
          <div>
            Civil Intelligent Transport System (EMAS Architecture v4.8)
          </div>
        </div>
      </div>
    </footer>
  );
};
