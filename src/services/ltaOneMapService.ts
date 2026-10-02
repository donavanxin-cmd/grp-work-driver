/**
 * Frontend client service for interacting with /api/* backend routes
 */

export interface HealthCheckResult {
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  credentials: {
    LTA_ACCOUNT_KEY: string;
    ONEMAP_ACCOUNT_KEY: string;
  };
  endpoints: Array<{
    path: string;
    description: string;
    upstream: string;
    status: string;
  }>;
}

export async function checkApiHealth(): Promise<HealthCheckResult | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('API health check error:', err);
    return null;
  }
}

export async function fetchTrafficIncidents() {
  try {
    const res = await fetch('/api/traffic-incidents');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching traffic incidents:', err);
    return null;
  }
}

export async function fetchEstTravelTimes() {
  try {
    const res = await fetch('/api/travel-times');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching travel times:', err);
    return null;
  }
}

export async function fetchFloodAlerts() {
  try {
    const res = await fetch('/api/flood-alerts');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching flood alerts:', err);
    return null;
  }
}

export async function fetchRoadWorks() {
  try {
    const res = await fetch('/api/road-works');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching road works:', err);
    return null;
  }
}

export async function fetchTrafficSpeedBands() {
  try {
    const res = await fetch('/api/traffic-speed-bands');
    return await res.json();
  } catch (err) {
    console.warn('Error fetching traffic speed bands:', err);
    return null;
  }
}

export async function fetchOneMapRoute(start: string, end: string, routeType = 'drive') {
  try {
    const res = await fetch(`/api/onemap-route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}`);
    return await res.json();
  } catch (err) {
    console.warn('Error fetching OneMap route:', err);
    return null;
  }
}
