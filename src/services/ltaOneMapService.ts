/**
 * Frontend client service for interacting with /api/* backend routes
 */

import { IncidentBulletin } from '../types/transit';

export interface HealthCheckResult {
  status: string;
  liveDataStreaming: boolean;
  timestamp: string;
  uptimeSeconds: number;
  ltaDataMall: {
    accountKeyPresent: boolean;
    probe: {
      tested: boolean;
      liveConnected: boolean;
      statusCode?: number;
      recordCount?: number;
      message: string;
    };
  };
  oneMap: {
    accountKeyPresent: boolean;
    status: string;
  };
  endpoints: Array<{
    path: string;
    description: string;
    upstream: string;
    mode: string;
  }>;
}

/**
 * Known Singapore location coordinates mapping (lat, lng, default expressway corridor)
 */
export const KNOWN_SINGAPORE_LOCATIONS: Record<string, { lat: number; lng: number; corridor: string; svg: [number, number] }> = {
  'woodlands': { lat: 1.4382, lng: 103.7890, corridor: 'SLE → CTE', svg: [410, 85] },
  'woodlands regional centre': { lat: 1.4382, lng: 103.7890, corridor: 'SLE → CTE', svg: [410, 85] },
  'marina bay': { lat: 1.2792, lng: 103.8540, corridor: 'CTE / MCE', svg: [545, 410] },
  'mbfc': { lat: 1.2792, lng: 103.8540, corridor: 'CTE / MCE', svg: [545, 410] },
  'marina bay financial centre': { lat: 1.2792, lng: 103.8540, corridor: 'CTE / MCE', svg: [545, 410] },
  'tuas': { lat: 1.3250, lng: 103.6360, corridor: 'AYE West', svg: [130, 350] },
  'tuas checkpoint': { lat: 1.3250, lng: 103.6360, corridor: 'AYE West', svg: [130, 350] },
  'changi': { lat: 1.3644, lng: 103.9915, corridor: 'PIE / ECP', svg: [690, 240] },
  'changi airport': { lat: 1.3644, lng: 103.9915, corridor: 'PIE / ECP', svg: [690, 240] },
  'jurong': { lat: 1.3329, lng: 103.7436, corridor: 'PIE / AYE', svg: [250, 305] },
  'jurong east': { lat: 1.3329, lng: 103.7436, corridor: 'PIE / AYE', svg: [250, 305] },
  'tampines': { lat: 1.3526, lng: 103.9447, corridor: 'PIE / TPE', svg: [630, 230] },
  'tampines central': { lat: 1.3526, lng: 103.9447, corridor: 'PIE / TPE', svg: [630, 230] },
  'bishan': { lat: 1.3508, lng: 103.8485, corridor: 'CTE Central', svg: [480, 260] },
  'junction 8': { lat: 1.3508, lng: 103.8485, corridor: 'CTE Central', svg: [480, 260] },
  'orchard': { lat: 1.3040, lng: 103.8318, corridor: 'CTE / Orchard', svg: [480, 340] },
  'ion orchard': { lat: 1.3040, lng: 103.8318, corridor: 'CTE / Orchard', svg: [480, 340] },
  'ang mo kio': { lat: 1.3691, lng: 103.8454, corridor: 'CTE', svg: [465, 235] },
  'bukit batok': { lat: 1.3590, lng: 103.7497, corridor: 'PIE / BKE', svg: [270, 260] },
  'harbourfront': { lat: 1.2644, lng: 103.8222, corridor: 'AYE / Telok Blangah', svg: [470, 430] },
  'vivocity': { lat: 1.2644, lng: 103.8222, corridor: 'AYE / Telok Blangah', svg: [470, 430] },
  'one-north': { lat: 1.2990, lng: 103.7870, corridor: 'AYE Central', svg: [380, 350] },
  'bedok': { lat: 1.3236, lng: 103.9273, corridor: 'PIE / ECP', svg: [610, 325] },
  'pasir ris': { lat: 1.3721, lng: 103.9474, corridor: 'TPE East', svg: [660, 180] },
  'sengkang': { lat: 1.3916, lng: 103.8953, corridor: 'TPE / KPE', svg: [590, 195] },
  'punggol': { lat: 1.4050, lng: 103.9020, corridor: 'TPE / KPE', svg: [600, 160] },
  'suntec city': { lat: 1.2930, lng: 103.8580, corridor: 'ECP / MCE', svg: [540, 395] },
  'raffles place': { lat: 1.2840, lng: 103.8510, corridor: 'CTE / MCE', svg: [535, 410] }
};

/**
 * Maps GPS lat/lon to SVG map coordinates
 */
export function gpsToSvgCoords(lat: number, lng: number): [number, number] {
  // Singapore bounds: lat [1.22, 1.47], lng [103.60, 104.04]
  // SVG Viewbox: [0, 0, 760, 480]
  const clampedLat = Math.max(1.22, Math.min(1.47, lat));
  const clampedLng = Math.max(103.60, Math.min(104.04, lng));

  const x = Math.round(((clampedLng - 103.60) / (104.04 - 103.60)) * (710 - 120) + 120);
  const y = Math.round(((1.47 - clampedLat) / (1.47 - 1.22)) * (430 - 70) + 70);
  return [x, y];
}

/**
 * Resolves any user input location string into GPS coordinates and SVG map coordinates
 */
export function resolveLocationToCoords(locName: string, defaultFallback: { lat: number; lng: number; svg: [number, number] }): {
  lat: number;
  lng: number;
  coordStr: string;
  svg: [number, number];
  corridor: string;
} {
  if (!locName || !locName.trim()) {
    return {
      lat: defaultFallback.lat,
      lng: defaultFallback.lng,
      coordStr: `${defaultFallback.lat},${defaultFallback.lng}`,
      svg: defaultFallback.svg,
      corridor: 'Main Expressway Corridor'
    };
  }

  const clean = locName.toLowerCase().trim();

  // 1. Check if raw coordinates like 1.35,103.82
  const coordMatch = clean.match(/^(\d+\.?\d*)\s*,\s*(\d+\.?\d*)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    return {
      lat,
      lng,
      coordStr: `${lat},${lng}`,
      svg: gpsToSvgCoords(lat, lng),
      corridor: 'Expressway Direct'
    };
  }

  // 2. Check known locations dictionary
  for (const [key, data] of Object.entries(KNOWN_SINGAPORE_LOCATIONS)) {
    if (clean.includes(key)) {
      return {
        lat: data.lat,
        lng: data.lng,
        coordStr: `${data.lat},${data.lng}`,
        svg: data.svg,
        corridor: data.corridor
      };
    }
  }

  // 3. Fallback based on text heuristics
  if (clean.includes('west') || clean.includes('jurong') || clean.includes('pioneer') || clean.includes('clementi')) {
    return { lat: 1.3250, lng: 103.7200, coordStr: '1.3250,103.7200', svg: [220, 320], corridor: 'AYE West Corridor' };
  }
  if (clean.includes('east') || clean.includes('changi') || clean.includes('airport') || clean.includes('tampines') || clean.includes('bedok')) {
    return { lat: 1.3550, lng: 103.9500, coordStr: '1.3550,103.9500', svg: [640, 240], corridor: 'PIE / ECP East Corridor' };
  }
  if (clean.includes('north') || clean.includes('woodlands') || clean.includes('yishun') || clean.includes('sembawang')) {
    return { lat: 1.4300, lng: 103.8100, coordStr: '1.4300,103.8100', svg: [420, 95], corridor: 'SLE / CTE North Corridor' };
  }

  return {
    lat: defaultFallback.lat,
    lng: defaultFallback.lng,
    coordStr: `${defaultFallback.lat},${defaultFallback.lng}`,
    svg: defaultFallback.svg,
    corridor: 'Singapore Expressway Network'
  };
}

export function generateDynamicRouteCoords(startSvg: [number, number], endSvg: [number, number]): [number, number][] {
  // Generate 4 to 6 natural polyline waypoints along Singapore's highway spine
  const [sx, sy] = startSvg;
  const [ex, ey] = endSvg;

  // Midpoint with gentle expressway curvature
  const midX = Math.round((sx + ex) / 2);
  const midY = Math.round((sy + ey) / 2);

  return [
    [sx, sy],
    [Math.round(sx * 0.7 + midX * 0.3), Math.round(sy * 0.7 + midY * 0.3)],
    [midX, midY],
    [Math.round(midX * 0.4 + ex * 0.6), Math.round(midY * 0.4 + ey * 0.6)],
    [ex, ey]
  ];
}

export function getStoredLTAKey(): string {
  try {
    return localStorage.getItem('LTA_ACCOUNT_KEY') || '';
  } catch (e) {
    return '';
  }
}

export function getStoredOneMapKey(): string {
  try {
    return localStorage.getItem('ONEMAP_ACCOUNT_KEY') || '';
  } catch (e) {
    return '';
  }
}

export function setStoredKeys(ltaKey: string, onemapKey: string) {
  try {
    if (ltaKey !== undefined) localStorage.setItem('LTA_ACCOUNT_KEY', ltaKey.trim());
    if (onemapKey !== undefined) localStorage.setItem('ONEMAP_ACCOUNT_KEY', onemapKey.trim());
  } catch (e) {}
}

function getRequestHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'accept': 'application/json'
  };
  const ltaKey = getStoredLTAKey();
  if (ltaKey) {
    headers['AccountKey'] = ltaKey;
    headers['x-account-key'] = ltaKey;
  }
  const onemapKey = getStoredOneMapKey();
  if (onemapKey) {
    headers['Authorization'] = onemapKey.startsWith('Bearer ') ? onemapKey : `Bearer ${onemapKey}`;
    headers['x-onemap-key'] = onemapKey;
  }
  return headers;
}

export async function checkApiHealth(): Promise<HealthCheckResult | null> {
  try {
    const ltaKey = getStoredLTAKey();
    const query = ltaKey ? `?accountKey=${encodeURIComponent(ltaKey)}` : '';
    const res = await fetch(`/api/health${query}`, {
      headers: getRequestHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('API health check error:', err);
    return null;
  }
}

export async function getKeysStatus() {
  try {
    const res = await fetch('/api/keys', {
      headers: getRequestHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function saveApiKeys(ltaAccountKey: string, onemapAccountKey: string) {
  setStoredKeys(ltaAccountKey, onemapAccountKey);
  try {
    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ltaAccountKey, onemapAccountKey })
    });
    return await res.json();
  } catch (err) {
    return { success: true, localOnly: true };
  }
}

export async function fetchTrafficIncidents() {
  try {
    const ltaKey = getStoredLTAKey();
    const query = ltaKey ? `?accountKey=${encodeURIComponent(ltaKey)}` : '';
    const res = await fetch(`/api/traffic-incidents${query}`, {
      headers: getRequestHeaders()
    });
    return await res.json();
  } catch (err) {
    console.warn('Error fetching traffic incidents:', err);
    return null;
  }
}

export async function fetchEstTravelTimes() {
  try {
    const ltaKey = getStoredLTAKey();
    const query = ltaKey ? `?accountKey=${encodeURIComponent(ltaKey)}` : '';
    const res = await fetch(`/api/travel-times${query}`, {
      headers: getRequestHeaders()
    });
    return await res.json();
  } catch (err) {
    console.warn('Error fetching travel times:', err);
    return null;
  }
}

export async function fetchFloodAlerts() {
  try {
    const ltaKey = getStoredLTAKey();
    const query = ltaKey ? `?accountKey=${encodeURIComponent(ltaKey)}` : '';
    const res = await fetch(`/api/flood-alerts${query}`, {
      headers: getRequestHeaders()
    });
    return await res.json();
  } catch (err) {
    console.warn('Error fetching flood alerts:', err);
    return null;
  }
}

export async function fetchRoadWorks() {
  try {
    const ltaKey = getStoredLTAKey();
    const query = ltaKey ? `?accountKey=${encodeURIComponent(ltaKey)}` : '';
    const res = await fetch(`/api/road-works${query}`, {
      headers: getRequestHeaders()
    });
    return await res.json();
  } catch (err) {
    console.warn('Error fetching road works:', err);
    return null;
  }
}

export async function fetchTrafficSpeedBands() {
  try {
    const ltaKey = getStoredLTAKey();
    const query = ltaKey ? `?accountKey=${encodeURIComponent(ltaKey)}` : '';
    const res = await fetch(`/api/traffic-speed-bands${query}`, {
      headers: getRequestHeaders()
    });
    return await res.json();
  } catch (err) {
    console.warn('Error fetching traffic speed bands:', err);
    return null;
  }
}

export async function fetchOneMapRoute(start: string, end: string, routeType = 'drive') {
  try {
    const onemapKey = getStoredOneMapKey();
    const tokenQuery = onemapKey ? `&token=${encodeURIComponent(onemapKey)}` : '';
    const res = await fetch(`/api/onemap-route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}${tokenQuery}`, {
      headers: getRequestHeaders()
    });
    return await res.json();
  } catch (err) {
    console.warn('Error fetching OneMap route:', err);
    return null;
  }
}

/**
 * Transforms raw LTA IncidentSet items into typed IncidentBulletin cards for the UI
 */
export function transformLTAIncidents(rawItems: any[]): IncidentBulletin[] {
  if (!Array.isArray(rawItems) || rawItems.length === 0) return [];

  return rawItems.map((item, idx) => {
    const msg = item.Message || '';
    // Extract date and time like (12/2)14:42
    const timeMatch = msg.match(/\((\d+\/\d+)\)\s*(\d{2}:\d{2})/);
    const dateStr = timeMatch ? timeMatch[1] : '02/10';
    const timeStr = timeMatch ? timeMatch[2] : '09:20';

    // Clean headline without date prefix
    const cleanHeadline = msg.replace(/\(\d+\/\d+\)\s*\d{2}:\d{2}\s*/, '').trim() || msg;

    // Detect avoid lane warning
    const avoidMatch = msg.match(/Avoid\s+(lane\s+\d+|right\s+lane|left\s+lane)/i);
    const actionTag = avoidMatch ? `Avoid ${avoidMatch[1]}` : (cleanHeadline.includes('Accident') ? 'Tow Required' : '+8m Delay');

    // Detect expressway
    let expressway = 'Other';
    const expMatch = msg.match(/\b(SLE|CTE|PIE|AYE|KJE|BKE|TPE|KPE|ECP|MCE)\b/);
    if (expMatch) {
      expressway = expMatch[1];
    } else if (msg.includes('Bartley')) {
      expressway = 'Bartley Viaduct';
    } else if (msg.includes('Telok Blangah')) {
      expressway = 'Telok Blangah';
    }

    const typeUpper = (item.Type || 'TRAFFIC INCIDENT').toUpperCase();
    let normalizedType: IncidentBulletin['type'] = 'TRAFFIC INCIDENT';
    if (typeUpper.includes('BREAKDOWN')) normalizedType = 'VEHICLE BREAKDOWN';
    else if (typeUpper.includes('ACCIDENT')) normalizedType = 'ROAD ACCIDENT';
    else if (typeUpper.includes('ROADWORK') || typeUpper.includes('ROAD WORK')) normalizedType = 'ROAD WORKS';
    else if (typeUpper.includes('HEAVY')) normalizedType = 'HEAVY TRAFFIC';

    const severity: IncidentBulletin['actionSeverity'] =
      normalizedType === 'VEHICLE BREAKDOWN' || normalizedType === 'ROAD ACCIDENT'
        ? 'critical'
        : 'moderate';

    return {
      id: `lta-live-${idx}-${Date.now()}`,
      type: normalizedType,
      dateStr,
      timeStr,
      headline: cleanHeadline,
      corridor: `${expressway} Corridor`,
      actionTag,
      actionSeverity: severity,
      category: normalizedType === 'ROAD WORKS' ? 'closures' : 'incidents',
      expressway,
      locationDetails: `GPS: ${Number(item.Latitude || 1.35).toFixed(4)}, ${Number(item.Longitude || 103.82).toFixed(4)}`
    };
  });
}
