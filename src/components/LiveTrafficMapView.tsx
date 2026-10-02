import React, { useState } from 'react';
import { Layers, Activity, AlertTriangle, Video, DollarSign, ArrowUpRight, Gauge } from 'lucide-react';
import { ROUTE_PRESETS, CCTV_CAMERAS, INCIDENT_BULLETINS, ERP_GANTRIES } from '../data/singaporeTransitData';
import { InteractiveTransitMap } from './InteractiveTransitMap';
import { CCTVModal } from './CCTVModal';

export const LiveTrafficMapView: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState(ROUTE_PRESETS[0]);
  const [activeLayers, setActiveLayers] = useState({
    speedFlow: true,
    incidents: true,
    cctv: true,
    erp: true
  });
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  const expresswayStatus = [
    { name: 'PIE', full: 'Pan Island Expressway', avgSpeed: '68 km/h', status: 'Optimal', color: '#10b981', alerts: 1 },
    { name: 'CTE', full: 'Central Expressway', avgSpeed: '42 km/h', status: 'Moderate Jam', color: '#f59e0b', alerts: 2 },
    { name: 'AYE', full: 'Ayer Rajah Expressway', avgSpeed: '58 km/h', status: 'Slow Tuas', color: '#ef4444', alerts: 1 },
    { name: 'SLE', full: 'Seletar Expressway', avgSpeed: '32 km/h', status: 'Lane 2 Tow', color: '#ef4444', alerts: 2 },
    { name: 'BKE', full: 'Bukit Timah Expressway', avgSpeed: '74 km/h', status: 'Optimal', color: '#10b981', alerts: 0 },
    { name: 'KJE', full: 'Kranji Expressway', avgSpeed: '52 km/h', status: 'Exit Queue', color: '#f59e0b', alerts: 1 },
    { name: 'TPE', full: 'Tampines Expressway', avgSpeed: '78 km/h', status: 'Optimal', color: '#10b981', alerts: 0 },
    { name: 'KPE', full: 'Kallang-Paya Lebar Expressway', avgSpeed: '70 km/h', status: 'Optimal', color: '#10b981', alerts: 0 },
    { name: 'ECP', full: 'East Coast Parkway', avgSpeed: '82 km/h', status: 'Clear Flow', color: '#10b981', alerts: 0 },
    { name: 'MCE', full: 'Marina Coastal Expressway', avgSpeed: '76 km/h', status: 'Clear Flow', color: '#10b981', alerts: 0 }
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
            Live Islandwide Traffic GIS Map
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Real-time inductive loop velocities, dynamic CCTV feeds, and incident telemetry across all 10 Singapore expressways.
          </p>
        </div>

        {/* Quick Corridor Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#64748b]">Select Focus:</span>
          {ROUTE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedPreset.id === p.id
                  ? 'bg-[#1c2442] text-white shadow-xs'
                  : 'bg-white border border-[#cbd5e1] text-[#334155] hover:bg-[#f1f5f9]'
              }`}
            >
              {p.label.split('→')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Map View (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <InteractiveTransitMap
            preset={selectedPreset}
            activeLayers={activeLayers}
            onToggleLayer={(l) => setActiveLayers((p) => ({ ...p, [l]: !p[l] }))}
            onSelectCamera={(id) => setSelectedCameraId(id)}
          />

          {/* Quick Camera Grid */}
          <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs">
            <h3 className="font-bold text-xs text-[#0f172a] mb-3 flex items-center justify-between">
              <span>Available Expressway Live Cameras</span>
              <span className="text-[11px] text-[#64748b] font-normal">Click any camera to preview full stream</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.values(CCTV_CAMERAS).map((cam) => (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCameraId(cam.id)}
                  className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg overflow-hidden cursor-pointer hover:border-[#2563eb] transition-all"
                >
                  <div className="aspect-video relative bg-black">
                    <img src={cam.imageSrc} alt={cam.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">
                      {cam.speedReading}
                    </span>
                  </div>
                  <div className="p-2 text-[11px]">
                    <div className="font-bold text-[#0f172a] truncate">{cam.name}</div>
                    <div className="text-[#64748b] text-[10px]">{cam.expressway} Corridor</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Expressway Telemetry Status (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-xs text-[#0f172a] flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#2563eb]" />
                <span>Expressway Velocity Index</span>
              </h3>
              <span className="text-[10px] text-[#64748b] font-mono">Updated 30s ago</span>
            </div>

            <div className="divide-y divide-[#f1f5f9] mt-2">
              {expresswayStatus.map((exp) => (
                <div key={exp.name} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#0f172a]">{exp.name}</span>
                      <span className="text-[11px] text-[#64748b]">· {exp.full}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                      <span style={{ color: exp.color }} className="font-semibold">{exp.status}</span>
                      {exp.alerts > 0 && (
                        <span className="text-[#ef4444] font-bold">({exp.alerts} Alert)</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-[#0f172a] tabular-nums">{exp.avgSpeed}</div>
                    <div className="text-[10px] text-[#64748b]">Corridor Average</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Gantry Rates Quick Panel */}
          <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs">
            <h3 className="font-bold text-xs text-[#0f172a] mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#2563eb]" />
              <span>Active ERP Gantry Surcharges</span>
            </h3>
            <div className="space-y-2 mt-2">
              {ERP_GANTRIES.slice(0, 4).map((g) => (
                <div key={g.id} className="p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-[#0f172a]">{g.name}</div>
                    <div className="text-[10px] text-[#64748b]">{g.activeHours}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-[#2563eb] text-sm">${g.currentRate.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CCTVModal
        cameraId={selectedCameraId}
        onClose={() => setSelectedCameraId(null)}
      />
    </div>
  );
};
