import React, { useState, useEffect } from 'react';
import {
  Navigation,
  ArrowRightLeft,
  Crosshair,
  AlertTriangle,
  Clock,
  Car,
  Lightbulb,
  ExternalLink,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  ROUTE_PRESETS,
  CCTV_CAMERAS,
  INCIDENT_BULLETINS,
  POPULAR_LOCATIONS
} from '../data/singaporeTransitData';
import { RoutePreset, RouteBias } from '../types/transit';
import { InteractiveTransitMap } from './InteractiveTransitMap';
import { CCTVModal } from './CCTVModal';
import { BypassSimulationModal } from './BypassSimulationModal';

interface RoutePlannerViewProps {
  onSelectIncident?: (id: string) => void;
  searchFilter?: string;
}

export const RoutePlannerView: React.FC<RoutePlannerViewProps> = ({
  onSelectIncident,
  searchFilter = ''
}) => {
  const [activePresetId, setActivePresetId] = useState<string>('sle-cte-cbd');
  const [originInput, setOriginInput] = useState<string>('Woodlands Ave 2 (Woodlands Regional Centre)');
  const [destInput, setDestInput] = useState<string>('Marina Bay Financial Centre (MBFC Tower 2)');
  const [routeBias, setRouteBias] = useState<RouteBias>('fastest');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState<boolean>(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState<boolean>(false);

  // Map layer controls
  const [activeLayers, setActiveLayers] = useState({
    speedFlow: true,
    incidents: true,
    cctv: true,
    erp: true
  });

  // Modal states
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [showBypassModal, setShowBypassModal] = useState<boolean>(false);
  const [isBypassApplied, setIsBypassApplied] = useState<boolean>(false);

  // Bottom bulletin filter
  const [bulletinFilter, setBulletinFilter] = useState<'incidents' | 'closures' | 'utilities'>('incidents');

  // Live timer for CCTV feeds
  const [currentTimeSec, setCurrentTimeSec] = useState<string>('09:25:38');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setCurrentTimeSec(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activePreset = ROUTE_PRESETS.find((p) => p.id === activePresetId) || ROUTE_PRESETS[0];

  const handleSelectPreset = (preset: RoutePreset) => {
    setActivePresetId(preset.id);
    setOriginInput(preset.origin);
    setDestInput(preset.destination);
    setIsBypassApplied(false);
  };

  const handleSwapLocations = () => {
    const temp = originInput;
    setOriginInput(destInput);
    setDestInput(temp);
  };

  const handleGpsLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOriginInput('Current GPS Location (Woodlands Sector)');
        },
        () => {
          setOriginInput('Woodlands Ave 2 (Woodlands Regional Centre)');
        }
      );
    } else {
      setOriginInput('Woodlands Ave 2 (Woodlands Regional Centre)');
    }
  };

  const handleCalculateRoute = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 400);
  };

  const handleToggleLayer = (layer: 'speedFlow' | 'incidents' | 'cctv' | 'erp') => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Filtered bulletins based on category and optional global search
  const filteredBulletins = INCIDENT_BULLETINS.filter((b) => {
    const matchesCategory = b.category === bulletinFilter;
    if (!matchesCategory) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        b.headline.toLowerCase().includes(q) ||
        b.corridor.toLowerCase().includes(q) ||
        b.expressway.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero Header & Fast Presets Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#d97706] uppercase">
            <span>Civil Intelligent Transport System</span>
            <span className="text-[#cbd5e1]">|</span>
            <span className="text-[#64748b] font-medium">EMAS v4.8</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight mt-1">
            Expressway Journey Planner & Live Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-3xl leading-relaxed">
            Real-time multi-corridor transit analysis cross-referenced with Land Transport Authority CCTV feeds, active ERP gantry schedules, and expressway incident sensors.
          </p>
        </div>

        {/* Fast Presets matching screenshot */}
        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#64748b]">
            Fast Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {ROUTE_PRESETS.map((p) => {
              const isSelected = activePreset.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1c2442] text-white shadow-xs'
                      : 'bg-white text-[#1e293b] border border-[#cbd5e1] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Route Input Container */}
      <div className="bg-white border border-[#cbd5e1] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto] items-center gap-3">
          {/* Origin Input */}
          <div className="relative">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                ORIGIN WAYPOINT
              </span>
              <button
                type="button"
                onClick={handleGpsLocate}
                className="flex items-center gap-1 text-[#2563eb] hover:text-[#1d4ed8] cursor-pointer"
              >
                <Crosshair className="w-3 h-3" />
                <span>GPS Locate</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                onFocus={() => setShowOriginSuggestions(true)}
                onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-[#0f172a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#10b981] bg-white"></span>
            </div>

            {/* Suggestions dropdown */}
            {showOriginSuggestions && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-[#cbd5e1] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1 text-xs">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onMouseDown={() => setOriginInput(loc)}
                    className="w-full text-left px-3 py-2 hover:bg-[#f1f5f9] text-[#1e293b]"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center pt-3 lg:pt-4">
            <button
              onClick={handleSwapLocations}
              className="p-2 text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] border border-[#cbd5e1] rounded-full transition-colors cursor-pointer"
              title="Swap Origin & Destination"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Target Input */}
          <div className="relative">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b] mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                DESTINATION TARGET
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={destInput}
                onChange={(e) => setDestInput(e.target.value)}
                onFocus={() => setShowDestSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium bg-[#f8fafc] border border-[#cbd5e1] rounded-xl text-[#0f172a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#ef4444]"></span>
            </div>

            {/* Suggestions dropdown */}
            {showDestSuggestions && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-[#cbd5e1] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1 text-xs">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onMouseDown={() => setDestInput(loc)}
                    className="w-full text-left px-3 py-2 hover:bg-[#f1f5f9] text-[#1e293b]"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calculate Route Button (Gold/Amber matching screenshot) */}
          <div className="pt-3 lg:pt-4">
            <button
              onClick={handleCalculateRoute}
              disabled={isCalculating}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0f172a] font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <AlertTriangle className="w-4 h-4 text-[#0f172a]" />
              <span>{isCalculating ? 'Computing Loops...' : 'Calculate Live Route'}</span>
            </button>
          </div>
        </div>

        {/* Route Bias Row */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#f1f5f9] text-xs gap-3">
          <div className="flex flex-wrap items-center gap-4 text-[#334155] font-medium">
            <span className="text-[11px] font-bold text-[#64748b] uppercase">ROUTE BIAS:</span>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="bias"
                checked={routeBias === 'fastest'}
                onChange={() => setRouteBias('fastest')}
                className="w-3.5 h-3.5 text-[#1c2442] focus:ring-[#2563eb]"
              />
              <span className={routeBias === 'fastest' ? 'font-bold text-[#0f172a]' : ''}>Fastest Corridor</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="bias"
                checked={routeBias === 'avoid_erp'}
                onChange={() => setRouteBias('avoid_erp')}
                className="w-3.5 h-3.5 text-[#1c2442] focus:ring-[#2563eb]"
              />
              <span className={routeBias === 'avoid_erp' ? 'font-bold text-[#0f172a]' : ''}>Avoid ERP Gantries</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="radio"
                name="bias"
                checked={routeBias === 'bypass_works'}
                onChange={() => setRouteBias('bypass_works')}
                className="w-3.5 h-3.5 text-[#1c2442] focus:ring-[#2563eb]"
              />
              <span className={routeBias === 'bypass_works' ? 'font-bold text-[#0f172a]' : ''}>Bypass Active Roadworks</span>
            </label>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#2563eb] font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>Speed algorithm calibrated with 2,400+ induction loops</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Telemetry Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Distance Analysis */}
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
                Distance Analysis
              </span>
              <div className="text-2xl font-bold text-[#0f172a] mt-1 font-mono tabular-nums">
                {activePreset.distanceKm} <span className="text-sm font-medium text-[#475569]">km total</span>
              </div>
              <div className="text-xs text-[#059669] font-medium mt-1">
                {activePreset.primaryCorridorText}
              </div>
            </div>
            <div className="p-2.5 bg-[#f1f5f9] rounded-lg text-[#1c2442]">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 2: Estimated Transit */}
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
                Estimated Transit
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#0f172a] font-mono tabular-nums">
                  {isBypassApplied
                    ? activePreset.transitMins - activePreset.alternativeBypass.timeSavingsMinutes
                    : activePreset.transitMins}
                </span>
                <span className="text-sm font-medium text-[#475569]">mins</span>
                {!isBypassApplied && activePreset.delayMins > 0 && (
                  <span className="text-[11px] font-bold bg-[#fee2e2] text-[#b91c1c] px-1.5 py-0.5 rounded">
                    +{activePreset.delayMins}m Jam
                  </span>
                )}
                {isBypassApplied && (
                  <span className="text-[11px] font-bold bg-[#ecfdf5] text-[#047857] px-1.5 py-0.5 rounded">
                    -6m Saved
                  </span>
                )}
              </div>
              <div className="text-xs text-[#64748b] mt-1">
                Standard free-flow: {activePreset.freeFlowMins} mins
              </div>
            </div>
            <div className="p-2.5 bg-[#fffbeb] rounded-lg text-[#d97706]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 3: Live Toll Estimate */}
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
                Live Toll Estimate
              </span>
              <div className="text-2xl font-bold text-[#2563eb] mt-1 font-mono tabular-nums">
                ${(isBypassApplied
                  ? activePreset.tollSGD + activePreset.alternativeBypass.tollDeltaSGD
                  : activePreset.tollSGD
                ).toFixed(2)}{' '}
                <span className="text-sm font-medium text-[#475569]">SGD</span>
              </div>
              <div className="text-xs text-[#64748b] mt-1">
                {activePreset.gantriesCount} active gantries operating
              </div>
            </div>
            <div className="p-2.5 bg-[#eff6ff] rounded-lg text-[#2563eb]">
              <div className="w-5 h-5 rounded-full border-2 border-[#2563eb] flex items-center justify-center text-[11px] font-bold font-mono">
                $
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Active Route Hazards */}
        <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#64748b] uppercase">
                Active Route Hazards
              </span>
              <div className="text-2xl font-bold text-[#ef4444] mt-1 font-mono tabular-nums">
                {isBypassApplied ? 0 : activePreset.hazardsCount}{' '}
                <span className="text-sm font-medium text-[#475569]">alerts active</span>
              </div>
              <div className="text-xs text-[#64748b] mt-1">
                {isBypassApplied
                  ? 'All bottlenecks bypassed'
                  : `${activePreset.breakdownsCount} Breakdown + ${activePreset.congestionsCount} Congestion`}
              </div>
            </div>
            <div className="p-2.5 bg-[#fef2f2] rounded-lg text-[#ef4444]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Velocity Spectrum Bar matching screenshot */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs space-y-2">
        <div className="flex flex-wrap items-center justify-between text-xs gap-2">
          <span className="font-bold text-[#0f172a]">Corridor Velocity Spectrum</span>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#475569]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
              <span>{activePreset.spectrum.clear}% Clear (&gt;65 km/h)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
              <span>{activePreset.spectrum.moderate}% Moderate (40-65 km/h)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
              <span>{activePreset.spectrum.heavy}% Heavy Delay (&lt;30 km/h)</span>
            </span>
          </div>
        </div>

        {/* Multi-segment continuous bar */}
        <div className="h-3 w-full bg-[#e2e8f0] rounded-full overflow-hidden flex">
          <div
            style={{ width: `${activePreset.spectrum.clear}%` }}
            className="bg-[#10b981] h-full transition-all duration-500"
            title={`${activePreset.spectrum.clear}% Clear`}
          ></div>
          <div
            style={{ width: `${activePreset.spectrum.moderate}%` }}
            className="bg-[#f59e0b] h-full transition-all duration-500"
            title={`${activePreset.spectrum.moderate}% Moderate`}
          ></div>
          <div
            style={{ width: `${activePreset.spectrum.heavy}%` }}
            className="bg-[#ef4444] h-full transition-all duration-500"
            title={`${activePreset.spectrum.heavy}% Heavy`}
          ></div>
        </div>
      </div>

      {/* Split View: Left Waypoint Telemetry vs Right GIS Map & Cameras */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Corridor Waypoint Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-[#0f172a] flex items-center gap-1.5">
              <span>Corridor Waypoint Telemetry</span>
            </h2>
            <span className="text-xs font-semibold text-[#2563eb]">{activePreset.corridorKey}</span>
          </div>

          {/* Telemetry Cards */}
          <div className="space-y-3">
            {activePreset.telemetryItems.map((item) => {
              const borderAccentColor =
                item.badgeType === 'critical'
                  ? 'border-l-[#ef4444]'
                  : item.badgeType === 'moderate'
                  ? 'border-l-[#f59e0b]'
                  : 'border-l-[#10b981]';

              return (
                <div
                  key={item.id}
                  className={`bg-white border border-[#cbd5e1] border-l-4 ${borderAccentColor} rounded-xl p-4 shadow-xs text-xs space-y-2.5 transition-all hover:shadow-sm`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold tracking-tight uppercase ${
                          item.badgeType === 'critical'
                            ? 'text-[#b91c1c]'
                            : item.badgeType === 'moderate'
                            ? 'text-[#b45309]'
                            : 'text-[#047857]'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-[#94a3b8]">·</span>
                      <span className="text-[#64748b] font-medium">{item.kmMarker}</span>
                    </div>
                    <span className="text-[#64748b] font-mono">{item.timeSGT}</span>
                  </div>

                  <h3 className="font-bold text-[#0f172a] text-sm leading-snug">
                    {item.headline}
                  </h3>

                  <p className="text-[#475569] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#1e293b] font-medium">
                      <span>{item.speedText}</span>
                      {item.speedVariance && (
                        <span className="text-[#ef4444] font-semibold">{item.speedVariance}</span>
                      )}
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.statusBadgeVariant === 'critical'
                          ? 'bg-[#fee2e2] text-[#991b1b]'
                          : item.statusBadgeVariant === 'blue'
                          ? 'bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]'
                          : item.statusBadgeVariant === 'optimal'
                          ? 'bg-[#ecfdf5] text-[#065f46]'
                          : 'bg-[#fffbeb] text-[#92400e]'
                      }`}
                    >
                      {item.statusBadgeText}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Alternative Route Recommendation Container matching screenshot */}
            <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="p-1 bg-[#dbeafe] rounded text-[#2563eb] shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#1e3a8a] text-xs">
                    Alternative Route Recommendation
                  </div>
                  <p className="text-[#3b82f6] text-[11px] mt-0.5 leading-relaxed font-normal">
                    {activePreset.alternativeBypass.summary}
                  </p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={() => setShowBypassModal(true)}
                  className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isBypassApplied ? 'Modify Bypass Simulation' : 'View Bypass Simulation'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {isBypassApplied && (
                  <span className="text-[11px] bg-[#10b981] text-white px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Bypass Active
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Map + Live Corridor CCTV Feeds */}
        <div className="lg:col-span-7 space-y-5">
          {/* Interactive GIS Vector Map */}
          <InteractiveTransitMap
            preset={activePreset}
            activeLayers={activeLayers}
            onToggleLayer={handleToggleLayer}
            onSelectCamera={(id) => setSelectedCameraId(id)}
            showBypass={isBypassApplied}
          />

          {/* Corridor CCTV Feeds matching screenshot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0f172a]">Corridor CCTV Feeds</h3>
              </div>
              <span className="text-xs text-[#64748b]">Live 2s refresh interval</span>
            </div>

            {/* 2 Camera Cards in a Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activePreset.cctvFeedIds.map((camId) => {
                const cam = CCTV_CAMERAS[camId];
                if (!cam) return null;
                return (
                  <div
                    key={cam.id}
                    className="bg-white border border-[#cbd5e1] rounded-xl overflow-hidden shadow-xs group"
                  >
                    {/* Camera Image with HUD overlays */}
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setSelectedCameraId(cam.id)}>
                      <img
                        src={cam.imageSrc}
                        alt={cam.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Top left timestamp overlay matching screenshot */}
                      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping"></span>
                        <span>REC ● {currentTimeSec}</span>
                      </div>

                      {/* Speed Badge overlay matching screenshot */}
                      <div className="absolute bottom-2 right-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            cam.speedStatus === 'slow'
                              ? 'bg-[#ef4444] text-white'
                              : cam.speedStatus === 'towing'
                              ? 'bg-[#f59e0b] text-black font-extrabold'
                              : 'bg-[#10b981] text-white'
                          }`}
                        >
                          {cam.speedReading}
                        </span>
                      </div>

                      {/* Camera Name banner on bottom left of image */}
                      <div className="absolute bottom-2 left-2 text-white text-[11px] font-semibold bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {cam.name}
                      </div>
                    </div>

                    {/* Bottom strip matching screenshot */}
                    <div className="px-3 py-2 flex items-center justify-between text-xs bg-[#f8fafc] border-t border-[#e2e8f0]">
                      <span className="text-[#64748b] text-[11px]">{cam.direction}</span>
                      <button
                        onClick={() => setSelectedCameraId(cam.id)}
                        className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <span>Enlarge</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Islandwide Traffic Bulletins & Road Works matching screenshot */}
      <section className="bg-white border border-[#cbd5e1] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#ef4444] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping"></span>
              <span>National Telemetry Dispatch</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight mt-1">
              Active Islandwide Traffic Bulletins & Road Works
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              Real-time EMAS updates, planned expressway maintenance, and statutory road diversions across Singapore.
            </p>
          </div>

          {/* Filter Tabs matching screenshot */}
          <div className="flex items-center gap-1.5 p-1 bg-[#f1f5f9] rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setBulletinFilter('incidents')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                bulletinFilter === 'incidents'
                  ? 'bg-[#1c2442] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0f172a]'
              }`}
            >
              Live Incidents (9)
            </button>
            <button
              onClick={() => setBulletinFilter('closures')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                bulletinFilter === 'closures'
                  ? 'bg-[#1c2442] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0f172a]'
              }`}
            >
              Temporary Closures & NSC
            </button>
            <button
              onClick={() => setBulletinFilter('utilities')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                bulletinFilter === 'utilities'
                  ? 'bg-[#1c2442] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0f172a]'
              }`}
            >
              Utility Road Works
            </button>
          </div>
        </div>

        {/* 6 Bulletins Grid matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBulletins.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectIncident && onSelectIncident(item.id)}
              className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 flex flex-col justify-between hover:bg-white hover:border-[#cbd5e1] hover:shadow-xs transition-all cursor-pointer text-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                  <span
                    className={`font-bold tracking-tight uppercase ${
                      item.actionSeverity === 'critical'
                        ? 'text-[#ef4444]'
                        : item.actionSeverity === 'moderate'
                        ? 'text-[#f59e0b]'
                        : 'text-[#d97706]'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-[#64748b]">
                    {item.dateStr} {item.timeStr}
                  </span>
                </div>

                <p className="font-medium text-[#0f172a] text-xs leading-relaxed">
                  {item.headline}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#e2e8f0] flex items-center justify-between text-[11px]">
                <span className="text-[#64748b] flex items-center gap-1 font-medium">
                  <span>{item.corridor}</span>
                </span>
                <span
                  className={`font-bold ${
                    item.actionSeverity === 'critical'
                      ? 'text-[#ef4444]'
                      : 'text-[#f59e0b]'
                  }`}
                >
                  {item.actionTag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CCTV Preview Modal */}
      <CCTVModal
        cameraId={selectedCameraId}
        onClose={() => setSelectedCameraId(null)}
        onSelectOtherCamera={(id) => setSelectedCameraId(id)}
      />

      {/* Bypass Simulation Modal */}
      <BypassSimulationModal
        isOpen={showBypassModal}
        onClose={() => setShowBypassModal(false)}
        preset={activePreset}
        onApplyBypass={() => setIsBypassApplied(!isBypassApplied)}
        isBypassActive={isBypassApplied}
      />
    </div>
  );
};
