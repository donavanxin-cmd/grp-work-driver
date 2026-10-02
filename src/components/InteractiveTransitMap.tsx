import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Video, AlertTriangle, DollarSign, Navigation2, Check } from 'lucide-react';
import { RoutePreset, ERPGantry, CCTVCamera } from '../types/transit';

interface InteractiveTransitMapProps {
  preset: RoutePreset;
  activeLayers: {
    speedFlow: boolean;
    incidents: boolean;
    cctv: boolean;
    erp: boolean;
  };
  onToggleLayer: (layer: 'speedFlow' | 'incidents' | 'cctv' | 'erp') => void;
  onSelectCamera: (cameraId: string) => void;
  onSelectGantry?: (gantry: ERPGantry) => void;
  showBypass?: boolean;
}

export const InteractiveTransitMap: React.FC<InteractiveTransitMapProps> = ({
  preset,
  activeLayers,
  onToggleLayer,
  onSelectCamera,
  showBypass = false
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.2));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.8));

  // Expressways network definition for background GIS vector canvas
  const expressways = [
    // PIE (Tuas to Changi)
    { id: 'PIE', path: 'M 140,350 Q 230,320 320,300 T 450,280 T 570,260 T 690,240', name: 'PIE' },
    // AYE (Tuas to MCE/Marina)
    { id: 'AYE', path: 'M 130,360 Q 220,365 310,370 T 430,390 T 530,410', name: 'AYE' },
    // SLE (BKE junction to CTE/TPE)
    { id: 'SLE', path: 'M 350,150 Q 390,120 430,155 T 480,180', name: 'SLE' },
    // CTE (SLE to AYE/MCE through tunnel)
    { id: 'CTE', path: 'M 450,180 Q 470,230 490,290 T 520,350 T 545,410', name: 'CTE' },
    // BKE (Woodlands to PIE)
    { id: 'BKE', path: 'M 410,85 Q 380,130 350,180 T 330,280', name: 'BKE' },
    // KJE (Choa Chu Kang to BKE)
    { id: 'KJE', path: 'M 250,240 Q 290,220 330,220', name: 'KJE' },
    // TPE (Seletar to Changi)
    { id: 'TPE', path: 'M 480,180 Q 560,160 630,190 T 680,235', name: 'TPE' },
    // KPE (TPE to MCE)
    { id: 'KPE', path: 'M 570,180 Q 560,250 550,330 T 545,410', name: 'KPE' },
    // ECP (Changi to Marina)
    { id: 'ECP', path: 'M 690,240 Q 640,310 590,360 T 545,410', name: 'ECP' },
    // MCE (Marina to Keppel)
    { id: 'MCE', path: 'M 545,410 Q 510,420 460,420', name: 'MCE' }
  ];

  // Helper to build SVG path from coords array
  const buildSvgPath = (points: [number, number][]) => {
    if (points.length === 0) return '';
    const [start, ...rest] = points;
    return `M ${start[0]},${start[1]} ` + rest.map(([x, y]) => `L ${x},${y}`).join(' ');
  };

  const activePathString = buildSvgPath(preset.mapRouteCoords);
  const bypassPathString = buildSvgPath(preset.alternativeBypass.bypassCoords);

  return (
    <div className={`flex flex-col bg-white border border-[#cbd5e1] rounded-xl overflow-hidden shadow-xs transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl ring-9999 ring-black/40' : 'relative'
    }`}>
      {/* Top Map Layer Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#f8fafc] border-b border-[#e2e8f0] text-xs gap-2">
        {/* Layer Toggles matching screenshot */}
        <div className="flex items-center gap-3 sm:gap-4 font-medium text-[#1e293b]">
          {/* Speed Flow */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-[#0f172a]">
            <input
              type="checkbox"
              checked={activeLayers.speedFlow}
              onChange={() => onToggleLayer('speedFlow')}
              className="w-3.5 h-3.5 rounded text-[#1c2442] focus:ring-[#2563eb] cursor-pointer"
            />
            <span className="flex items-center gap-1 text-[#0f172a]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              Speed Flow
            </span>
          </label>

          {/* Incidents */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-[#0f172a]">
            <input
              type="checkbox"
              checked={activeLayers.incidents}
              onChange={() => onToggleLayer('incidents')}
              className="w-3.5 h-3.5 rounded text-[#1c2442] focus:ring-[#2563eb] cursor-pointer"
            />
            <span className="flex items-center gap-1 text-[#0f172a]">
              <AlertTriangle className="w-3 h-3 text-[#ef4444]" />
              Incidents
            </span>
          </label>

          {/* CCTV */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-[#0f172a]">
            <input
              type="checkbox"
              checked={activeLayers.cctv}
              onChange={() => onToggleLayer('cctv')}
              className="w-3.5 h-3.5 rounded text-[#1c2442] focus:ring-[#2563eb] cursor-pointer"
            />
            <span className="flex items-center gap-1 text-[#0f172a]">
              <Video className="w-3 h-3 text-[#2563eb]" />
              CCTV
            </span>
          </label>

          {/* ERP */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-[#0f172a]">
            <input
              type="checkbox"
              checked={activeLayers.erp}
              onChange={() => onToggleLayer('erp')}
              className="w-3.5 h-3.5 rounded text-[#1c2442] focus:ring-[#2563eb] cursor-pointer"
            />
            <span className="flex items-center gap-1 text-[#0f172a]">
              <span className="w-3 h-3 rounded-full bg-[#2563eb] text-white text-[9px] flex items-center justify-center font-bold">O</span>
              ERP
            </span>
          </label>
        </div>

        {/* Right side GIS Info & Fullscreen */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#64748b]">OneMap Vector GIS</span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-[#64748b] hover:text-[#0f172a] hover:bg-[#e2e8f0] rounded transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand GIS Map'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG GIS Map Viewport */}
      <div className={`relative w-full overflow-hidden bg-[#242933] select-none ${
        isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-[360px] sm:h-[400px]'
      }`}>
        <svg
          viewBox="0 0 760 480"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Dark GIS Gradient */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e232d" />
              <stop offset="100%" stopColor="#171b24" />
            </linearGradient>

            {/* Singapore Landmass Fill */}
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2e3440" />
              <stop offset="100%" stopColor="#292e39" />
            </linearGradient>

            {/* Route Glow Filter */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.6" />
            </filter>
            
            <filter id="hazardGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ef4444" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Water (Johor Strait & Singapore Strait) */}
          <rect width="760" height="480" fill="url(#waterGrad)" />

          {/* Johor / Malaysia coastline hint at top */}
          <path
            d="M 50,20 Q 200,40 380,35 T 580,25 T 740,30 L 760,0 L 0,0 Z"
            fill="#232832"
            opacity="0.8"
          />

          {/* Singapore Main Island vector silhouette */}
          <path
            d="M 110,340 
               C 100,320 120,290 160,280
               C 210,270 250,210 320,180
               C 360,160 370,110 400,75
               C 420,55 450,60 480,95
               C 510,120 540,130 580,140
               C 630,150 670,180 720,200
               C 745,210 750,240 730,265
               C 700,300 660,330 620,355
               C 580,380 540,425 480,430
               C 430,435 370,420 320,410
               C 260,400 200,405 150,380
               Z"
            fill="url(#landGrad)"
            stroke="#3b4252"
            strokeWidth="1.5"
          />

          {/* Sentosa Island */}
          <path
            d="M 450,440 C 470,435 500,440 520,445 C 500,455 470,455 450,440 Z"
            fill="#2e3440"
            stroke="#3b4252"
            strokeWidth="1"
          />

          {/* Jurong Island */}
          <path
            d="M 160,390 C 190,385 220,395 240,415 C 220,435 180,435 160,390 Z"
            fill="#272d37"
            stroke="#3b4252"
            strokeWidth="1"
          />

          {/* Pulau Ubin & Tekong */}
          <path
            d="M 640,145 C 670,140 690,155 675,165 C 650,165 635,155 640,145 Z"
            fill="#2e3440"
            stroke="#3b4252"
            strokeWidth="1"
          />

          {/* Topographical / Regional Labels matching screenshot */}
          <g className="text-[10px] font-sans fill-[#818a99] select-none pointer-events-none">
            <text x="390" y="80" textAnchor="end">Woodlands</text>
            <text x="280" y="240">Hillion Mall</text>
            <text x="240" y="290">BUKIT BATOK</text>
            <text x="420" y="240">Windsor Nature Park</text>
            <text x="460" y="210">ANG MO KIO</text>
            <text x="540" y="235">HOUGANG</text>
            <text x="590" y="195">SENGKANG</text>
            <text x="660" y="180">Pasir Ris</text>
            <text x="640" y="220">IKEA Tampines</text>
            <text x="670" y="295">Singapore EXPO</text>
            <text x="610" y="325">BEDOK</text>
            <text x="515" y="300">NOVENA</text>
            <text x="535" y="360">KALLANG</text>
            <text x="440" y="390">Clarke Quay</text>
            <text x="380" y="420">BUKIT MERAH</text>
            <text x="495" y="450" className="fill-[#9aa3b2] font-semibold text-[13px]">Singapore</text>
          </g>

          {/* Base Expressway Network lines (grey/charcoal) */}
          <g stroke="#434c5e" strokeWidth="2.5" fill="none" opacity="0.6">
            {expressways.map((exp) => (
              <path key={exp.id} d={exp.path} />
            ))}
          </g>

          {/* Dynamic Speed Flow Colored Heatmap Layer */}
          {activeLayers.speedFlow && (
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
              {/* PIE flowing green */}
              <path d="M 140,350 Q 230,320 320,300 T 450,280" stroke="#10b981" strokeWidth="3" />
              <path d="M 450,280 T 570,260 T 690,240" stroke="#10b981" strokeWidth="3" />
              {/* AYE smooth flow */}
              <path d="M 130,360 Q 220,365 310,370" stroke="#ef4444" strokeWidth="3.5" />
              <path d="M 310,370 T 430,390 T 530,410" stroke="#10b981" strokeWidth="3" />
              {/* TPE green */}
              <path d="M 480,180 Q 560,160 630,190 T 680,235" stroke="#10b981" strokeWidth="3" />
              {/* KJE moderate yellow */}
              <path d="M 250,240 Q 290,220 330,220" stroke="#f59e0b" strokeWidth="3.5" />
            </g>
          )}

          {/* Optional Alternative Bypass Route line */}
          {showBypass && (
            <g fill="none">
              <path
                d={bypassPathString}
                stroke="#60a5fa"
                strokeWidth="4"
                strokeDasharray="6,4"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </g>
          )}

          {/* Active Navigation Primary Route Line */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Background halo */}
            <path
              d={activePathString}
              stroke="#0f172a"
              strokeWidth="7"
              opacity="0.5"
            />
            {/* Colored Segment 1: Woodlands to Mandai (Decelerating towards Breakdown - Red/Orange) */}
            <path
              d="M 410,85 L 430,160"
              stroke="#ef4444"
              strokeWidth="4"
              filter="url(#hazardGlow)"
            />
            {/* Colored Segment 2: Mandai down through Seletar & Ang Mo Kio (Clear / Moderate - Orange to Green) */}
            <path
              d="M 430,160 L 445,195 L 465,235"
              stroke="#f59e0b"
              strokeWidth="4"
            />
            {/* Colored Segment 3: Moulmein Jam bottleneck (Orange) */}
            <path
              d="M 465,235 L 490,290 L 515,340"
              stroke="#f59e0b"
              strokeWidth="4"
            />
            {/* Colored Segment 4: CTE Tunnel into Marina Bay (Green Smooth) */}
            <path
              d="M 515,340 L 530,375 L 545,410"
              stroke="#10b981"
              strokeWidth="4"
            />
          </g>

          {/* Interactive Markers Layer: ERP, Incidents, Cameras */}
          {/* ERP Gantry Marker ($1.50 / $2.00) matching screenshot */}
          {activeLayers.erp && (
            <g
              transform="translate(485, 275)"
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredPoint('ERP: CTE Moulmein ($2.00)')}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <rect
                x="-34"
                y="-11"
                width="68"
                height="22"
                rx="4"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                className="fill-white text-[11px] font-bold font-mono tracking-tight"
              >
                ERP $1.50
              </text>
            </g>
          )}

          {/* Incident Hazard Marker: Mandai Ave (Red Warning triangle) */}
          {activeLayers.incidents && (
            <g
              transform="translate(430, 160)"
              className="cursor-pointer transition-transform hover:scale-110 animate-bounce"
              onMouseEnter={() => setHoveredPoint('EMAS Breakdown: Lane 2 Blocked (Mandai)')}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle r="12" fill="#ef4444" opacity="0.3" className="animate-ping" />
              <polygon points="0,-10 9,7 -9,7" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" className="fill-white text-[9px] font-black">!</text>
            </g>
          )}

          {/* Incident Hazard Marker 2: Moulmein CTE Jam (Yellow Warning) */}
          {activeLayers.incidents && (
            <g
              transform="translate(490, 290)"
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => setHoveredPoint('CTE Moulmein Congestion: +8m Delay')}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" className="fill-black text-[10px] font-black">!</text>
            </g>
          )}

          {/* CCTV Camera Icons */}
          {activeLayers.cctv && (
            <>
              {/* CCTV 1: Mandai */}
              <g
                transform="translate(445, 175)"
                onClick={() => onSelectCamera('sle-mandai')}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredPoint('Live CCTV: SLE Mandai Flyover')}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle r="10" fill="#1c2442" stroke="#60a5fa" strokeWidth="1.5" />
                <path d="M -4,-3 L 1,-3 L 1,3 L -4,3 Z M 1,-1 L 4,-3 L 4,3 L 1,1 Z" fill="#ffffff" />
              </g>

              {/* CCTV 2: Moulmein */}
              <g
                transform="translate(508, 305)"
                onClick={() => onSelectCamera('cte-moulmein')}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredPoint('Live CCTV: CTE Moulmein Flyover')}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle r="10" fill="#1c2442" stroke="#60a5fa" strokeWidth="1.5" />
                <path d="M -4,-3 L 1,-3 L 1,3 L -4,3 Z M 1,-1 L 4,-3 L 4,3 L 1,1 Z" fill="#ffffff" />
              </g>
            </>
          )}

          {/* Origin Waypoint Pin (Green circle with text box: Woodlands Ave 2) */}
          <g transform={`translate(${preset.originCoord[0]}, ${preset.originCoord[1]})`}>
            {/* Concentric rings */}
            <circle r="9" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
            <circle r="7" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
            {/* Label callout */}
            <g transform="translate(14, -8)">
              <rect
                x="0"
                y="0"
                width="100"
                height="20"
                rx="4"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              />
              <text x="8" y="14" className="fill-[#0f172a] text-[10px] font-semibold">
                Woodlands Ave 2
              </text>
            </g>
          </g>

          {/* Destination Target Pin (Red pin with text box: Marina Bay MBFC) */}
          <g transform={`translate(${preset.destCoord[0]}, ${preset.destCoord[1]})`}>
            <circle r="10" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
            <circle r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
            {/* Label callout */}
            <g transform="translate(14, -8)">
              <rect
                x="0"
                y="0"
                width="104"
                height="20"
                rx="4"
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              />
              <text x="8" y="14" className="fill-[#0f172a] text-[10px] font-semibold">
                Marina Bay (MBFC)
              </text>
            </g>
          </g>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#0f172a]/95 text-white px-3 py-1.5 rounded-md text-xs font-medium border border-white/20 shadow-lg pointer-events-none z-20 backdrop-blur-xs">
            {hoveredPoint}
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute right-3 bottom-3 flex flex-col gap-1 z-10 bg-white/90 backdrop-blur-xs border border-[#cbd5e1] rounded-lg shadow-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-[#f1f5f9] text-[#1e293b] transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-[1px] bg-[#e2e8f0]"></div>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-[#f1f5f9] text-[#1e293b] transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Active Telemetry Floating Card matching screenshot */}
        <div className="absolute left-3 bottom-3 bg-[#0f172a]/90 backdrop-blur-md text-white border border-white/15 rounded-lg p-2.5 shadow-lg text-xs z-10 max-w-[220px]">
          <div className="text-[10px] font-bold tracking-wider text-[#93c5fd] uppercase">
            Active Telemetry
          </div>
          <div className="font-semibold text-white mt-0.5 text-xs">
            Tracking {preset.distanceKm}km Sector
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#cbd5e1] mt-0.5 font-mono">
            <span>Avg: 51.4 km/h</span>
            <span className="text-[#94a3b8]">·</span>
            <span className="text-[#fca5a5]">Lat: +{preset.delayMins}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
