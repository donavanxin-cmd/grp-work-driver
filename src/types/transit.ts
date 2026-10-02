export type RouteBias = 'fastest' | 'avoid_erp' | 'bypass_works';

export interface RoutePreset {
  id: string;
  label: string;
  origin: string;
  destination: string;
  corridorKey: string;
  distanceKm: number;
  transitMins: number;
  freeFlowMins: number;
  delayMins: number;
  tollSGD: number;
  gantriesCount: number;
  hazardsCount: number;
  breakdownsCount: number;
  congestionsCount: number;
  spectrum: {
    clear: number;
    moderate: number;
    heavy: number;
  };
  primaryCorridorText: string;
  telemetryItems: RouteTelemetryItem[];
  alternativeBypass: AlternativeBypass;
  mapRouteCoords: [number, number][]; // SVG coordinates [x, y]
  originCoord: [number, number];
  destCoord: [number, number];
  cctvFeedIds: string[];
}

export interface RouteTelemetryItem {
  id: string;
  category: 'EMAS BREAKDOWN' | 'INCIDENT & BOTTLENECK' | 'CLEAR FLOW' | 'ROADWORKS';
  badgeType: 'critical' | 'moderate' | 'optimal';
  kmMarker: string;
  timeSGT: string;
  headline: string;
  description: string;
  speedText: string;
  speedVariance?: string;
  statusBadgeText: string;
  statusBadgeVariant: 'critical' | 'moderate' | 'optimal' | 'blue';
  erpInfo?: string;
}

export interface AlternativeBypass {
  summary: string;
  timeSavingsMinutes: number;
  tollDeltaSGD: number;
  routeDescription: string;
  bypassCoords: [number, number][];
}

export interface IncidentBulletin {
  id: string;
  type: 'VEHICLE BREAKDOWN' | 'TRAFFIC INCIDENT' | 'ROAD ACCIDENT' | 'ACCIDENT & TAILBACK' | 'HEAVY TRAFFIC' | 'ROAD WORKS';
  dateStr: string;
  timeStr: string;
  headline: string;
  corridor: string;
  actionTag: string;
  actionSeverity: 'critical' | 'moderate' | 'warning';
  category: 'incidents' | 'closures' | 'utilities';
  expressway: string;
  locationDetails: string;
  coordinates?: [number, number];
}

export interface CCTVCamera {
  id: string;
  name: string;
  location: string;
  expressway: string;
  direction: string;
  imageSrc: string;
  speedReading: string;
  speedStatus: 'slow' | 'moderate' | 'smooth' | 'towing';
  lastUpdated: string;
  gantryNearby?: string;
  coordinates: [number, number];
}

export interface ERPGantry {
  id: string;
  name: string;
  zone: 'CTE' | 'AYE' | 'PIE' | 'ECP' | 'CBD' | 'Orchard';
  currentRate: number;
  nextRate: number;
  nextTimeSlot: string;
  activeHours: string;
  status: 'ACTIVE' | 'FREE' | 'STANDBY';
  coordinates: [number, number];
}

export interface RoadClosureItem {
  id: string;
  title: string;
  project: string;
  expresswayOrRoad: string;
  impact: string;
  timing: string;
  detourAdvice: string;
  status: 'In Progress' | 'Upcoming' | 'Recurring Nightly';
}
