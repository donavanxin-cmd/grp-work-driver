import React, { useState, useEffect } from 'react';
import { AlertTriangle, Filter, Search, Phone, ShieldCheck, MapPin, Clock, Radio, RefreshCw } from 'lucide-react';
import { INCIDENT_BULLETINS } from '../data/singaporeTransitData';
import { IncidentBulletin } from '../types/transit';
import { fetchTrafficIncidents } from '../services/ltaOneMapService';

interface IncidentsAlertsViewProps {
  onSelectIncident?: (id: string) => void;
}

export const IncidentsAlertsView: React.FC<IncidentsAlertsViewProps> = ({ onSelectIncident }) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterExpressway, setFilterExpressway] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [liveSourceStatus, setLiveSourceStatus] = useState<string>('LTA DataMall');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadLiveIncidents = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchTrafficIncidents();
      if (result?.source) {
        setLiveSourceStatus(result.source);
      }
    } catch (e) {
      console.warn('LTA incident fetch:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLiveIncidents();
  }, []);

  const expresswaysList = ['ALL', 'SLE', 'CTE', 'AYE', 'PIE', 'KJE', 'Bartley Viaduct', 'NSC', 'ECP'];

  const filtered = INCIDENT_BULLETINS.filter((item) => {
    if (filterType !== 'ALL' && !item.type.includes(filterType)) return false;
    if (filterExpressway !== 'ALL' && item.expressway !== filterExpressway) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.headline.toLowerCase().includes(q) ||
        item.corridor.toLowerCase().includes(q) ||
        item.locationDetails.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ef4444] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping"></span>
            <span>EMAS Central Incident Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight mt-1">
            Expressway Incidents & Emergency Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Active highway breakdowns, obstructions, traffic collisions, and lane diversions dispatched by LTA Intelligent Transport Systems.
          </p>
        </div>

        {/* EMAS Breakdown hotline callout */}
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 bg-[#ef4444] rounded-lg text-white">
            <Phone className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-[#991b1b]">EMAS 24/7 Breakdown Assistance</div>
            <div className="text-sm font-extrabold text-[#7f1d1d] font-mono">1800-CALL-LTA (1800 225 5582)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#64748b] text-[11px] uppercase">Incident Type:</span>
          {['ALL', 'BREAKDOWN', 'ACCIDENT', 'TRAFFIC', 'ROAD WORKS'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-[#1c2442] text-white'
                  : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search corridor, milepost..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-xs text-[#0f172a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <Search className="w-3.5 h-3.5 text-[#94a3b8] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={filterExpressway}
            onChange={(e) => setFilterExpressway(e.target.value)}
            className="px-3 py-1.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-xs font-medium text-[#1e293b] focus:outline-none"
          >
            {expresswaysList.map((exp) => (
              <option key={exp} value={exp}>
                {exp === 'ALL' ? 'All Expressways' : exp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incidents Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectIncident && onSelectIncident(item.id)}
            className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-[#2563eb] transition-all cursor-pointer text-xs space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    item.actionSeverity === 'critical'
                      ? 'bg-[#fee2e2] text-[#991b1b]'
                      : 'bg-[#fffbeb] text-[#92400e]'
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-[#64748b] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.dateStr} {item.timeStr} SGT
                </span>
              </div>

              <h3 className="font-bold text-[#0f172a] text-sm leading-snug">
                {item.headline}
              </h3>

              <div className="mt-2 text-[#475569] text-xs flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#64748b] shrink-0 mt-0.5" />
                <span>{item.locationDetails}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
              <span className="text-[#64748b] font-medium">{item.corridor}</span>
              <span
                className={`font-bold px-2 py-0.5 rounded ${
                  item.actionSeverity === 'critical'
                    ? 'bg-[#fee2e2] text-[#ef4444]'
                    : 'bg-[#fffbeb] text-[#f59e0b]'
                }`}
              >
                {item.actionTag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
