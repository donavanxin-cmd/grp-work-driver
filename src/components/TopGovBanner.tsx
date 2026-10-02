import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, ExternalLink } from 'lucide-react';

export const TopGovBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#f0f3f8] border-b border-[#e2e8f0] text-xs text-[#475569] font-sans relative z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Singapore Coat of Arms / Crest emblem */}
          <div className="flex items-center gap-1.5 font-medium text-[#1e293b]">
            <svg
              className="w-4 h-4 text-[#ba1a1a] shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 2.18l6 2.25v4.66c0 4.1-2.67 7.95-6 9-3.33-1.05-6-4.9-6-9V6.43l6-2.25zM12 7a2.5 2.5 0 0 0-2.5 2.5c0 1.05.65 1.95 1.57 2.32L10 16h4l-1.07-4.18c.92-.37 1.57-1.27 1.57-2.32A2.5 2.5 0 0 0 12 7z" />
            </svg>
            <span>A Singapore Government Agency Website</span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[#334155] hover:text-[#0f172a] transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded px-1"
          aria-expanded={isOpen}
        >
          <span>How to identify</span>
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
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0f172a]">Official government websites end with .gov.sg</p>
                <p className="text-[#64748b] mt-0.5 leading-relaxed">
                  Before sharing sensitive information, verify that you're on an official government website like lta.gov.sg or onemap.gov.sg.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#ecfdf5] rounded-lg text-[#059669] shrink-0 mt-0.5">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-[#0f172a]">Secure websites use HTTPS</p>
                <p className="text-[#64748b] mt-0.5 leading-relaxed">
                  Look for a lock icon in your browser address bar or 'https://' prefix to ensure your connection to Land Transport Authority is encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
