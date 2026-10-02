import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Radio, Camera, ShieldAlert, Car, Gauge, MapPin } from 'lucide-react';
import { CCTV_CAMERAS } from '../data/singaporeTransitData';
import { CCTVCamera } from '../types/transit';

interface CCTVModalProps {
  cameraId: string | null;
  onClose: () => void;
  onSelectOtherCamera?: (id: string) => void;
}

export const CCTVModal: React.FC<CCTVModalProps> = ({
  cameraId,
  onClose,
  onSelectOtherCamera
}) => {
  const [secondsTick, setSecondsTick] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsTick((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!cameraId || !CCTV_CAMERAS[cameraId]) return null;
  const camera: CCTVCamera = CCTV_CAMERAS[cameraId];

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSecondsTick(0);
    }, 500);
  };

  const getSimulatedLiveTime = () => {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] text-white border border-[#334155] rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155] bg-[#1e293b]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#ef4444] animate-pulse" />
            <span className="font-bold text-sm text-white tracking-tight">
              LTA EMAS HIGH-DEF SURVEILLANCE FEED
            </span>
            <span className="text-[11px] bg-[#334155] px-2 py-0.5 rounded text-[#94a3b8] font-mono">
              CAM-{camera.id.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              className={`p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#334155] rounded transition-all cursor-pointer ${
                isRefreshing ? 'rotate-180 transition-transform duration-500' : ''
              }`}
              title="Refresh Camera Frame"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#94a3b8] hover:text-white hover:bg-[#ef4444] rounded transition-colors cursor-pointer"
              title="Close Feed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Frame */}
        <div className="relative bg-black aspect-video w-full overflow-hidden flex items-center justify-center">
          <img
            src={camera.imageSrc}
            alt={camera.name}
            className="w-full h-full object-cover"
          />

          {/* CCTV HUD Telemetry Overlay */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs px-2.5 py-1.5 rounded border border-white/20 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-ping"></span>
              <span className="font-bold text-[#ef4444]">REC ● {getSimulatedLiveTime()} SGT</span>
            </div>
            <div className="text-[11px] text-[#cbd5e1] mt-0.5">{camera.name}</div>
          </div>

          <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs px-2.5 py-1.5 rounded border border-white/20 text-xs font-mono text-right">
            <div className="text-[10px] text-[#94a3b8]">CORRIDOR SPEED</div>
            <div className={`font-bold ${
              camera.speedStatus === 'slow' || camera.speedStatus === 'towing' ? 'text-[#f59e0b]' : 'text-[#10b981]'
            }`}>
              {camera.speedReading}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs bg-black/70 backdrop-blur-xs px-3 py-1.5 rounded border border-white/10">
            <div className="flex items-center gap-2 text-[#94a3b8]">
              <MapPin className="w-3.5 h-3.5 text-[#60a5fa]" />
              <span className="text-white font-medium">{camera.location}</span>
              <span>·</span>
              <span className="text-[#cbd5e1]">{camera.direction}</span>
            </div>
            <div className="text-[#94a3b8] text-[11px] font-mono">
              Telemetry Sync: &lt;2.0s
            </div>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1e293b] border-t border-[#334155] text-xs">
          <div className="bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
            <div className="text-[#94a3b8] text-[11px] flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-[#60a5fa]" />
              Corridor Flow
            </div>
            <div className="font-bold text-white mt-1 text-sm">{camera.speedReading}</div>
            <div className="text-[10px] text-[#64748b]">Sensor calibration nominal</div>
          </div>

          <div className="bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
            <div className="text-[#94a3b8] text-[11px] flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-[#f59e0b]" />
              Nearby Toll
            </div>
            <div className="font-bold text-white mt-1 text-sm">{camera.gantryNearby || 'No gantry on span'}</div>
            <div className="text-[10px] text-[#64748b]">Electronic Road Pricing</div>
          </div>

          <div className="bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
            <div className="text-[#94a3b8] text-[11px] flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" />
              EMAS Status
            </div>
            <div className="font-bold text-[#ef4444] mt-1 text-sm">
              {camera.id === 'sle-mandai' ? 'Tow Assigned' : 'Monitored'}
            </div>
            <div className="text-[10px] text-[#64748b]">Response unit 41 on scene</div>
          </div>

          <div className="bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
            <div className="text-[#94a3b8] text-[11px] flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-[#10b981]" />
              Optics Health
            </div>
            <div className="font-bold text-[#10b981] mt-1 text-sm">1080p 30fps Live</div>
            <div className="text-[10px] text-[#64748b]">Infrared HDR Active</div>
          </div>
        </div>

        {/* Other Corridor Cameras Switcher */}
        <div className="px-4 py-3 bg-[#0f172a] border-t border-[#334155] flex items-center justify-between text-xs">
          <span className="text-[#94a3b8]">Switch to other corridor cameras:</span>
          <div className="flex items-center gap-2">
            {Object.values(CCTV_CAMERAS).map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectOtherCamera && onSelectOtherCamera(c.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  c.id === camera.id
                    ? 'bg-[#2563eb] text-white'
                    : 'bg-[#1e293b] text-[#cbd5e1] hover:bg-[#334155] hover:text-white'
                }`}
              >
                {c.expressway}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
