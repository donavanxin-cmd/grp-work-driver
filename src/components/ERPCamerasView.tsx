import React, { useState } from 'react';
import { DollarSign, Video, Clock, Filter, Eye, RefreshCw } from 'lucide-react';
import { ERP_GANTRIES, CCTV_CAMERAS } from '../data/singaporeTransitData';
import { CCTVModal } from './CCTVModal';

export const ERPCamerasView: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<'Passenger Cars' | 'Motorcycles' | 'Heavy Vehicles'>('Passenger Cars');
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  const multiplier = vehicleType === 'Motorcycles' ? 0.5 : vehicleType === 'Heavy Vehicles' ? 1.5 : 1.0;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#2563eb] uppercase tracking-wider">
          <DollarSign className="w-4 h-4 text-[#2563eb]" />
          <span>LTA Electronic Road Pricing & Intelligent CCTV</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight mt-1">
          ERP Gantry Surcharges & Surveillance Matrices
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
          Live gantry rates by time window, vehicle class coefficients, and expressway surveillance camera grid.
        </p>
      </div>

      {/* Vehicle Type Selector */}
      <div className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#64748b] text-[11px] uppercase">Vehicle Category:</span>
          {(['Passenger Cars', 'Motorcycles', 'Heavy Vehicles'] as const).map((vt) => (
            <button
              key={vt}
              onClick={() => setVehicleType(vt)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                vehicleType === vt
                  ? 'bg-[#1c2442] text-white'
                  : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
              }`}
            >
              {vt}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-[#64748b]">
          Rates calibrated to LTA quarterly ERP rate review criteria
        </div>
      </div>

      {/* Section 1: ERP Gantries Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#2563eb]" />
          <span>Active Gantry Pricing ({vehicleType})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ERP_GANTRIES.map((g) => {
            const currentCharge = (g.currentRate * multiplier).toFixed(2);
            const nextCharge = (g.nextRate * multiplier).toFixed(2);

            return (
              <div
                key={g.id}
                className="bg-white border border-[#cbd5e1] rounded-xl p-4 shadow-xs flex flex-col justify-between text-xs space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded">
                      ZONE {g.zone}
                    </span>
                    <span className="font-mono text-[#059669] font-bold">
                      {g.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#0f172a] text-sm leading-snug">
                    {g.name}
                  </h3>

                  <div className="mt-2 text-[#64748b] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Operational Window: {g.activeHours}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#64748b]">Current Toll</div>
                    <div className="text-lg font-bold text-[#2563eb] font-mono tabular-nums">
                      ${currentCharge} SGD
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-[#64748b]">Next ({g.nextTimeSlot})</div>
                    <div className="text-sm font-semibold text-[#475569] font-mono tabular-nums">
                      ${nextCharge} SGD
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Expressway CCTV Cameras */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
            <Video className="w-4 h-4 text-[#2563eb]" />
            <span>Expressway CCTV Surveillance Feeds</span>
          </h2>
          <span className="text-xs text-[#64748b]">Real-time EMAS snapshots</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(CCTV_CAMERAS).map((cam) => (
            <div
              key={cam.id}
              className="bg-white border border-[#cbd5e1] rounded-xl overflow-hidden shadow-xs hover:border-[#2563eb] transition-all group flex flex-col justify-between"
            >
              <div
                className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                onClick={() => setSelectedCameraId(cam.id)}
              >
                <img
                  src={cam.imageSrc}
                  alt={cam.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 bg-black/75 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                  REC ● LIVE
                </div>
                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                  {cam.speedReading}
                </div>
              </div>

              <div className="p-3 text-xs space-y-1">
                <div className="font-bold text-[#0f172a] text-xs truncate">{cam.name}</div>
                <div className="text-[#64748b] text-[11px]">{cam.location}</div>
                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-[#2563eb] font-medium">{cam.direction}</span>
                  <button
                    onClick={() => setSelectedCameraId(cam.id)}
                    className="text-[#2563eb] hover:underline font-bold cursor-pointer"
                  >
                    Enlarge Feed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CCTVModal
        cameraId={selectedCameraId}
        onClose={() => setSelectedCameraId(null)}
      />
    </div>
  );
};
