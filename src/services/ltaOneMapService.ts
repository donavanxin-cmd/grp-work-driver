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
