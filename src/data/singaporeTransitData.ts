import {
  RoutePreset,
  IncidentBulletin,
  CCTVCamera,
  ERPGantry,
  RoadClosureItem
} from '../types/transit';

import cteMoulmeinImg from '../assets/images/cctv_cte_moulmein_1790905500551.jpg';
import sleMandaiImg from '../assets/images/cctv_sle_mandai_1790905515668.jpg';
import pieJalanAnakImg from '../assets/images/cctv_pie_jalan_anak_1790905528087.jpg';

export const CCTV_CAMERAS: Record<string, CCTVCamera> = {
  'cte-moulmein': {
    id: 'cte-moulmein',
    name: 'CTE • Moulmein Flyover',
    location: 'Central Expressway (KM 6.8)',
    expressway: 'CTE',
    direction: 'Towards AYE / City',
    imageSrc: cteMoulmeinImg,
    speedReading: '38 km/h (Slow)',
    speedStatus: 'slow',
    lastUpdated: '09:25:38',
    gantryNearby: 'CTE Moulmein Gantry 22 ($2.00)',
    coordinates: [490, 290]
  },
  'sle-mandai': {
    id: 'sle-mandai',
    name: 'SLE • Mandai Ave Flyover',
    location: 'Seletar Expressway (KM 14.2)',
    expressway: 'SLE',
    direction: 'Towards CTE Junction',
    imageSrc: sleMandaiImg,
    speedReading: 'Lane 2 Towing',
    speedStatus: 'towing',
    lastUpdated: '09:25:35',
    gantryNearby: 'SLE Nil Gantry Zone',
    coordinates: [430, 160]
  },
  'pie-mount-pleasant': {
    id: 'pie-mount-pleasant',
    name: 'PIE • Mount Pleasant / Jalan Anak Bukit',
    location: 'Pan Island Expressway (KM 18.5)',
    expressway: 'PIE',
    direction: 'Towards Changi / Airport',
    imageSrc: pieJalanAnakImg,
    speedReading: '68 km/h (Flowing)',
    speedStatus: 'smooth',
    lastUpdated: '09:26:10',
    gantryNearby: 'PIE Kallang Bahru ($1.00)',
    coordinates: [370, 290]
  },
  'aye-clementi': {
    id: 'aye-clementi',
    name: 'AYE • Clementi Flyover',
    location: 'Ayer Rajah Expressway (KM 11.2)',
    expressway: 'AYE',
    direction: 'Towards Tuas / Jurong',
    imageSrc: pieJalanAnakImg,
    speedReading: '55 km/h (Moderate)',
    speedStatus: 'moderate',
    lastUpdated: '09:25:12',
    gantryNearby: 'AYE Alexandra ($1.50)',
    coordinates: [290, 360]
  }
};

export const ROUTE_PRESETS: RoutePreset[] = [
  {
    id: 'sle-cte-cbd',
    label: 'SLE / CTE → CBD',
    origin: 'Woodlands Ave 2 (Woodlands Regional Centre)',
    destination: 'Marina Bay Financial Centre (MBFC Tower 2)',
    corridorKey: 'SLE • CTE • CBD',
    distanceKm: 24.8,
    transitMins: 34,
    freeFlowMins: 26,
    delayMins: 8,
    tollSGD: 4.50,
    gantriesCount: 3,
    hazardsCount: 2,
    breakdownsCount: 1,
    congestionsCount: 1,
    spectrum: {
      clear: 72,
      moderate: 18,
      heavy: 10
    },
    primaryCorridorText: 'Via SLE → CTE Tunnel',
    originCoord: [410, 85],
    destCoord: [545, 410],
    mapRouteCoords: [
      [410, 85],   // Woodlands
      [430, 160],  // Mandai Flyover
      [445, 195],  // SLE-CTE junction (Seletar)
      [465, 235],  // Ang Mo Kio
      [490, 290],  // Moulmein / Braddell
      [515, 340],  // Novena / Cairnhill
      [530, 375],  // CTE Tunnel entry
      [545, 410]   // Marina Bay MBFC
    ],
    telemetryItems: [
      {
        id: 't-1',
        category: 'EMAS BREAKDOWN',
        badgeType: 'critical',
        kmMarker: 'KM 14.2 • SLE',
        timeSGT: '09:22 SGT',
        headline: 'SLE (towards CTE) after Woodlands Ave 2',
        description: 'Vehicle breakdown blocking Lane 2. Recovery tow dispatched by EMAS unit 41. Expect sudden deceleration on approach from Mandai Flyover.',
        speedText: '28 km/h',
        speedVariance: '(-35 km/h vs avg)',
        statusBadgeText: 'Lane 2 Closed',
        statusBadgeVariant: 'critical'
      },
      {
        id: 't-2',
        category: 'INCIDENT & BOTTLENECK',
        badgeType: 'moderate',
        kmMarker: 'KM 6.8 • CTE',
        timeSGT: '09:18 SGT',
        headline: 'CTE (towards AYE) after Moulmein Rd',
        description: 'Heavy queue building from Braddell Flyover trailing towards Moulmein exit. Average additional transit latency estimated at +8 minutes.',
        speedText: '38 km/h Heavy Flow',
        statusBadgeText: 'ERP: $2.00 active',
        statusBadgeVariant: 'blue'
      },
      {
        id: 't-3',
        category: 'CLEAR FLOW',
        badgeType: 'optimal',
        kmMarker: 'KM 1.2 • CTE Tunnel',
        timeSGT: 'Optimal',
        headline: 'CTE Tunnel → Marina Blvd / Sheares Ave',
        description: 'Tunnel environmental monitors clear. Lane discipline maintained. Smooth arrival into Marina Bay CBD zone.',
        speedText: '74 km/h (Speed Limit: 80)',
        statusBadgeText: 'No delays',
        statusBadgeVariant: 'optimal'
      }
    ],
    alternativeBypass: {
      summary: 'Bypass Moulmein bottleneck via KJE → BKE → PIE → MCE to save approximately 6 minutes. ERP surcharge delta: -$0.50.',
      timeSavingsMinutes: 6,
      tollDeltaSGD: -0.50,
      routeDescription: 'Woodlands → BKE → PIE Westbound → KPE / MCE bypass directly into Marina South.',
      bypassCoords: [
        [410, 85],
        [370, 150],
        [320, 220],
        [350, 310],
        [450, 370],
        [545, 410]
      ]
    },
    cctvFeedIds: ['cte-moulmein', 'sle-mandai']
  },
  {
    id: 'tuas-changi-aye-pie',
    label: 'Tuas → Changi (AYE/PIE)',
    origin: 'Tuas Checkpoint / Link (West Gate)',
    destination: 'Changi Airport Terminal 3 (Departure Blvd)',
    corridorKey: 'AYE • PIE • ECP',
    distanceKm: 42.6,
    transitMins: 48,
    freeFlowMins: 38,
    delayMins: 10,
    tollSGD: 3.00,
    gantriesCount: 2,
    hazardsCount: 1,
    breakdownsCount: 1,
    congestionsCount: 0,
    spectrum: {
      clear: 80,
      moderate: 14,
      heavy: 6
    },
    primaryCorridorText: 'Via AYE → PIE Airport Direct',
    originCoord: [130, 350],
    destCoord: [690, 240],
    mapRouteCoords: [
      [130, 350],
      [210, 355],
      [290, 360],
      [370, 290],
      [470, 270],
      [590, 250],
      [690, 240]
    ],
    telemetryItems: [
      {
        id: 't-21',
        category: 'EMAS BREAKDOWN',
        badgeType: 'critical',
        kmMarker: 'KM 31.4 • AYE',
        timeSGT: '08:52 SGT',
        headline: 'AYE (towards Tuas) after Tuas West Rd',
        description: 'Accident blocking Lane 2. LTA EMAS recovery crew in attendance. Heavy goods vehicle detour advised via Pioneer Road.',
        speedText: '32 km/h',
        speedVariance: '(-28 km/h vs avg)',
        statusBadgeText: 'Tow Required',
        statusBadgeVariant: 'critical'
      },
      {
        id: 't-22',
        category: 'CLEAR FLOW',
        badgeType: 'optimal',
        kmMarker: 'KM 12.0 • PIE',
        timeSGT: '09:20 SGT',
        headline: 'PIE Airport Corridor (after Tampines Flyover)',
        description: 'Airport corridor running clear at regulatory cruising velocities. Induction loops recording zero deceleration events.',
        speedText: '82 km/h (Speed Limit: 90)',
        statusBadgeText: 'Clear Runway Approach',
        statusBadgeVariant: 'optimal'
      }
    ],
    alternativeBypass: {
      summary: 'Stay on AYE through Keppel Viaduct → MCE → ECP to avoid central PIE bottleneck. Adds +2.1km with no tolls.',
      timeSavingsMinutes: 4,
      tollDeltaSGD: 0.00,
      routeDescription: 'AYE South Coast Coastal Expressway corridor bypassing city core.',
      bypassCoords: [
        [130, 350],
        [250, 370],
        [410, 420],
        [545, 410],
        [640, 320],
        [690, 240]
      ]
    },
    cctvFeedIds: ['aye-clementi', 'pie-mount-pleasant']
  },
  {
    id: 'jurong-tampines-pie',
    label: 'Jurong → Tampines (PIE)',
    origin: 'Jurong East Gateway (Jurong Town Hall)',
    destination: 'Tampines Central Hub (Ave 4)',
    corridorKey: 'PIE Crosstown Arterial',
    distanceKm: 29.5,
    transitMins: 36,
    freeFlowMins: 29,
    delayMins: 7,
    tollSGD: 2.00,
    gantriesCount: 2,
    hazardsCount: 1,
    breakdownsCount: 0,
    congestionsCount: 1,
    spectrum: {
      clear: 68,
      moderate: 22,
      heavy: 10
    },
    primaryCorridorText: 'Via Pan Island Expressway Central',
    originCoord: [250, 305],
    destCoord: [630, 230],
    mapRouteCoords: [
      [250, 305],
      [310, 300],
      [370, 290],
      [450, 275],
      [540, 255],
      [630, 230]
    ],
    telemetryItems: [
      {
        id: 't-31',
        category: 'INCIDENT & BOTTLENECK',
        badgeType: 'moderate',
        kmMarker: 'KM 19.8 • PIE',
        timeSGT: '09:12 SGT',
        headline: 'PIE (towards Changi) near Jalan Anak Bukit',
        description: 'Intermittent slowdown due to slip road merges. Police traffic escort completed clearing.',
        speedText: '42 km/h Flowing',
        statusBadgeText: 'Moderate Queue',
        statusBadgeVariant: 'moderate'
      },
      {
        id: 't-32',
        category: 'CLEAR FLOW',
        badgeType: 'optimal',
        kmMarker: 'KM 5.2 • PIE East',
        timeSGT: '09:24 SGT',
        headline: 'PIE Eastbound (after Eunos Flyover)',
        description: 'Clean transit corridor with 5 lanes fully operational through Tampines Ave 5 flyover.',
        speedText: '78 km/h',
        statusBadgeText: 'Optimal Speed',
        statusBadgeVariant: 'optimal'
      }
    ],
    alternativeBypass: {
      summary: 'Divert via AYE Eastbound → MCE → KPE Northbound to enter Tampines via Bartley East connector.',
      timeSavingsMinutes: 5,
      tollDeltaSGD: 1.00,
      routeDescription: 'Southern Expressway loop avoiding Central catchment works.',
      bypassCoords: [
        [250, 305],
        [320, 370],
        [490, 410],
        [570, 330],
        [630, 230]
      ]
    },
    cctvFeedIds: ['pie-mount-pleasant', 'cte-moulmein']
  }
];

export const INCIDENT_BULLETINS: IncidentBulletin[] = [
  {
    id: 'inc-1',
    type: 'VEHICLE BREAKDOWN',
    dateStr: '02/10',
    timeStr: '09:22',
    headline: 'Vehicle Breakdown on SLE (towards CTE) after Woodlands Ave 2. Avoid lane 2.',
    corridor: 'SLE Corridor',
    actionTag: 'Avoid Lane 2',
    actionSeverity: 'critical',
    category: 'incidents',
    expressway: 'SLE',
    locationDetails: 'After Woodlands Ave 2 exit towards CTE junction',
    coordinates: [430, 160]
  },
  {
    id: 'inc-2',
    type: 'TRAFFIC INCIDENT',
    dateStr: '02/10',
    timeStr: '09:18',
    headline: 'Incident on CTE (towards AYE) after Moulmein Rd.',
    corridor: 'CTE Central',
    actionTag: '+8m Delay',
    actionSeverity: 'moderate',
    category: 'incidents',
    expressway: 'CTE',
    locationDetails: 'Between Moulmein Rd and Balestier Rd exits',
    coordinates: [490, 290]
  },
  {
    id: 'inc-3',
    type: 'VEHICLE BREAKDOWN',
    dateStr: '02/10',
    timeStr: '09:08',
    headline: 'Vehicle Breakdown on Bartley Road (towards Tampines) after Upper Serangoon Road. Avoid lane 2.',
    corridor: 'Bartley Arterial',
    actionTag: 'Avoid Lane 2',
    actionSeverity: 'critical',
    category: 'incidents',
    expressway: 'Bartley Viaduct',
    locationDetails: 'Bartley Eastbound viaduct over Upper Serangoon',
    coordinates: [520, 240]
  },
  {
    id: 'inc-4',
    type: 'ROAD ACCIDENT',
    dateStr: '02/10',
    timeStr: '08:52',
    headline: 'Accident on AYE (towards Tuas) after Tuas West Rd. Avoid lane 2.',
    corridor: 'AYE Westbound',
    actionTag: 'Tow Required',
    actionSeverity: 'critical',
    category: 'incidents',
    expressway: 'AYE',
    locationDetails: 'Tuas Industrial Link prior to Gul Circle',
    coordinates: [130, 350]
  },
  {
    id: 'inc-5',
    type: 'ACCIDENT & TAILBACK',
    dateStr: '02/10',
    timeStr: '08:38',
    headline: 'Accident on SLE (towards CTE) after Mandai Ave with congestion till Woodlands Ave 2.',
    corridor: 'SLE Expressway',
    actionTag: 'Heavy Jam',
    actionSeverity: 'critical',
    category: 'incidents',
    expressway: 'SLE',
    locationDetails: 'Mandai flyover span to Lentor Ave',
    coordinates: [430, 160]
  },
  {
    id: 'inc-6',
    type: 'HEAVY TRAFFIC',
    dateStr: '02/10',
    timeStr: '08:34',
    headline: 'Heavy Traffic on KJE (towards BKE) at BKE (Woodlands) Exit.',
    corridor: 'KJE → BKE Inter',
    actionTag: 'Congested',
    actionSeverity: 'moderate',
    category: 'incidents',
    expressway: 'KJE',
    locationDetails: 'Bukit Panjang interchange ramp',
    coordinates: [320, 210]
  },
  {
    id: 'inc-7',
    type: 'ROAD WORKS',
    dateStr: '02/10',
    timeStr: '07:30',
    headline: 'North-South Corridor (NSC) viaduct construction along Marymount Road towards CTE.',
    corridor: 'NSC Corridor',
    actionTag: 'Single Lane Divert',
    actionSeverity: 'moderate',
    category: 'closures',
    expressway: 'NSC',
    locationDetails: 'Marymount Flyover junction',
    coordinates: [470, 260]
  },
  {
    id: 'inc-8',
    type: 'ROAD WORKS',
    dateStr: '02/10',
    timeStr: '06:00',
    headline: 'PUB Deep Tunnel Sewerage utility shaft works along Lornie Highway. Left shoulder closed.',
    corridor: 'Central Catchment',
    actionTag: 'Speed 50 km/h',
    actionSeverity: 'warning',
    category: 'utilities',
    expressway: 'Lornie Hwy',
    locationDetails: 'MacRitchie Underpass entrance',
    coordinates: [450, 280]
  },
  {
    id: 'inc-9',
    type: 'TRAFFIC INCIDENT',
    dateStr: '02/10',
    timeStr: '08:15',
    headline: 'Debris cleared on ECP (towards City) after Fort Road exit. All lanes reopened.',
    corridor: 'ECP Coastal',
    actionTag: 'Lanes Reopened',
    actionSeverity: 'moderate',
    category: 'incidents',
    expressway: 'ECP',
    locationDetails: 'Fort Road viaduct section',
    coordinates: [580, 360]
  }
];

export const ERP_GANTRIES: ERPGantry[] = [
  {
    id: 'erp-cte-1',
    name: 'CTE Southbound after Braddell Rd',
    zone: 'CTE',
    currentRate: 2.00,
    nextRate: 3.00,
    nextTimeSlot: '09:30 - 10:00',
    activeHours: '08:00 - 10:00',
    status: 'ACTIVE',
    coordinates: [480, 270]
  },
  {
    id: 'erp-cte-2',
    name: 'CTE Moulmein Gantry 22',
    zone: 'CTE',
    currentRate: 2.00,
    nextRate: 1.50,
    nextTimeSlot: '09:30 - 10:00',
    activeHours: '07:30 - 10:00',
    status: 'ACTIVE',
    coordinates: [490, 290]
  },
  {
    id: 'erp-cbd-1',
    name: 'Marina Boulevard Cordon (MBFC)',
    zone: 'CBD',
    currentRate: 1.50,
    nextRate: 2.00,
    nextTimeSlot: '10:00 - 10:30',
    activeHours: '08:00 - 19:00',
    status: 'ACTIVE',
    coordinates: [545, 410]
  },
  {
    id: 'erp-aye-1',
    name: 'AYE Alexandra Road (Eastbound)',
    zone: 'AYE',
    currentRate: 1.50,
    nextRate: 0.00,
    nextTimeSlot: '09:30 - 10:00',
    activeHours: '07:30 - 09:30',
    status: 'ACTIVE',
    coordinates: [330, 370]
  },
  {
    id: 'erp-pie-1',
    name: 'PIE Kallang Bahru Flyover',
    zone: 'PIE',
    currentRate: 1.00,
    nextRate: 1.00,
    nextTimeSlot: '09:30 - 10:00',
    activeHours: '08:00 - 09:30',
    status: 'ACTIVE',
    coordinates: [520, 310]
  },
  {
    id: 'erp-orchard-1',
    name: 'Orchard Cordon (Scotts Road)',
    zone: 'Orchard',
    currentRate: 1.00,
    nextRate: 2.00,
    nextTimeSlot: '12:00 - 12:30',
    activeHours: '12:00 - 20:00',
    status: 'STANDBY',
    coordinates: [480, 340]
  }
];

export const ROAD_CLOSURES: RoadClosureItem[] = [
  {
    id: 'closure-1',
    title: 'North-South Corridor (NSC) Viaduct Launching Works',
    project: 'Land Transport Authority NSC Contract N106',
    expresswayOrRoad: 'Marymount Road & Ang Mo Kio Ave 1 intersection',
    impact: 'Single lane closure on right carriageway',
    timing: 'Daily 23:00 - 05:00 (Ongoing until Q4 2026)',
    detourAdvice: 'Motorists towards CTE advised to use Bishan Road or Thomson Road.',
    status: 'In Progress'
  },
  {
    id: 'closure-2',
    title: 'SLE Resurfacing & Variable Message Sign Gantry Maintenance',
    project: 'Expressway Routine Asset Integrity Management',
    expresswayOrRoad: 'Seletar Expressway (towards CTE) between Lentor & Mandai',
    impact: 'Lane 1 & 2 closed consecutively',
    timing: 'Mondays to Thursdays 00:30 - 05:00',
    detourAdvice: 'Reduce speed to 50 km/h; watch for EMAS safety attenuator trucks.',
    status: 'Recurring Nightly'
  },
  {
    id: 'closure-3',
    title: 'Marina Coastal Expressway (MCE) Tunnel Jet Fan Overhaul',
    project: 'MCE Fire Safety & Ventilation Maintenance',
    expresswayOrRoad: 'MCE Westbound Tunnel towards AYE',
    impact: 'Full closure of slip road into Maxwell Road',
    timing: 'Saturday 01:00 - 05:30',
    detourAdvice: 'Exit via Central Boulevard or Sheares Avenue into CBD.',
    status: 'Upcoming'
  },
  {
    id: 'closure-4',
    title: 'Cross Island Line (CRL) MRT Station Underground Mining',
    project: 'CRL Phase 1 Construction',
    expresswayOrRoad: 'Tampines Expressway (TPE) near Pasir Ris Dr 8',
    impact: 'Slip road diversion with gentler curve radius',
    timing: 'Permanent diversion with dedicated lane markers',
    detourAdvice: 'Follow temporary orange road studs and posted 60 km/h advisory.',
    status: 'In Progress'
  }
];

export const POPULAR_LOCATIONS = [
  'Woodlands Ave 2 (Woodlands Regional Centre)',
  'Marina Bay Financial Centre (MBFC Tower 2)',
  'Tuas Checkpoint / Link (West Gate)',
  'Changi Airport Terminal 3 (Departure Blvd)',
  'Jurong East Gateway (Jurong Town Hall)',
  'Tampines Central Hub (Ave 4)',
  'Bishan Junction 8 (Bishan Place)',
  'VivoCity / HarbourFront Centre',
  'Orchard Road (ION Orchard)',
  'One-North Fusionopolis (Ayer Rajah Ave)',
  'Suntec City Mall (Temasek Blvd)',
  'Raffles Place (UOB Plaza)'
];
