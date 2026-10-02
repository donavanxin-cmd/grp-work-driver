import React, { useState } from 'react';
import { Search, Bell, Globe, User, X, AlertTriangle } from 'lucide-react';
import { INCIDENT_BULLETINS } from '../data/singaporeTransitData';

export type NavTab = 'map' | 'planner' | 'incidents' | 'closures' | 'erp';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectIncident?: (incidentId: string) => void;
  onOpenApiHealth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onSelectIncident,
  onOpenApiHealth
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | '中文' | 'Melayu' | 'தமிழ்'>('EN');

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'map', label: 'Live Traffic Map' },
    { id: 'planner', label: 'Journey Route Planner' },
    { id: 'incidents', label: 'Incidents & Alerts' },
    { id: 'closures', label: 'Road Closures' },
    { id: 'erp', label: 'ERP & Cameras' }
  ];

  return (
    <nav className="bg-[#ffffff] border-b border-[#e2e8f0] sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left section: Network Status Pill & Nav Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2">
            {/* Live Network Status Pill with API Health trigger */}
            <div
              onClick={onOpenApiHealth}
              className="flex items-center bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-full px-2.5 py-1 text-xs shrink-0 select-none cursor-pointer transition-colors"
              title="Click to view API Health & LTA/OneMap Endpoint Diagnostics"
            >
              <span className="flex items-center gap-1.5 font-medium text-[#1e293b]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
                </span>
                <span>Live Network: <span className="font-semibold text-[#047857]">Normal</span></span>
              </span>
              <span className="ml-2 bg-[#ef4444] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
                4 Alerts
              </span>
            </div>

            {/* Navigation tabs */}
            <div className="flex items-center gap-1 shrink-0">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#1c2442] text-[#ffffff] shadow-sm'
                        : 'text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right section: Search, Notifications, Language, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Input */}
            <div className="relative hidden md:block w-48 lg:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Expressway, gantry..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-[#0f172a] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f172a]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors relative cursor-pointer"
                title="Active Dispatch Alerts"
                aria-label="Dispatch alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full ring-2 ring-white"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#cbd5e1] rounded-xl shadow-lg z-50 p-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                      <span className="font-semibold text-xs text-[#0f172a]">Active Dispatch Bulletins</span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[#94a3b8] hover:text-[#0f172a]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                    {INCIDENT_BULLETINS.slice(0, 4).map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setShowNotifications(false);
                          if (onSelectIncident) onSelectIncident(inc.id);
                        }}
                        className="p-2 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] cursor-pointer transition-colors text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-[#ef4444]">{inc.type}</span>
                          <span className="text-[#64748b]">{inc.timeStr} SGT</span>
                        </div>
                        <p className="text-[#1e293b] font-medium leading-snug line-clamp-2">{inc.headline}</p>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-[#64748b]">
                          <span>{inc.corridor}</span>
                          <span className="text-[#b91c1c] font-semibold">{inc.actionTag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#e2e8f0] mt-2 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onTabChange('incidents');
                      }}
                      className="text-xs text-[#2563eb] hover:underline font-semibold"
                    >
                      View all 9 live incidents →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-[#334155] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors cursor-pointer"
                aria-label="Language selection"
              >
                <Globe className="w-3.5 h-3.5 text-[#64748b]" />
                <span>{currentLang}</span>
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-1 w-28 bg-white border border-[#cbd5e1] rounded-lg shadow-md z-50 py-1 text-xs">
                  {(['EN', '中文', 'Melayu', 'தமிழ்'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-[#f1f5f9] font-medium ${
                        currentLang === lang ? 'text-[#2563eb] font-bold' : 'text-[#334155]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-[#1c2442] text-white flex items-center justify-center text-xs font-semibold shadow-xs ring-1 ring-[#cbd5e1] shrink-0"
              title="Civil Transport Operator Session"
            >
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
