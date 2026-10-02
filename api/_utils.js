/**
 * Helper utility for LTA DataMall and OneMap API integration
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Runtime in-memory key cache to support live key injection via UI without restart
export const RUNTIME_KEYS = {
  LTA_ACCOUNT_KEY: process.env.LTA_ACCOUNT_KEY || '',
  ONEMAP_ACCOUNT_KEY: process.env.ONEMAP_ACCOUNT_KEY || ''
};

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey, x-account-key, x-onemap-key');
}

export function handleCors(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return true;
  }
  return false;
}

/**
 * Resolves LTA AccountKey from query params, request headers, runtime cache, or environment
 */
export function resolveLTAKey(req) {
  if (req) {
    // 1. Check query parameter
    try {
      const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      const qKey = url.searchParams.get('accountKey') || url.searchParams.get('apiKey');
      if (qKey && qKey.trim()) return qKey.trim();
    } catch (e) {}

    // 2. Check headers (case-insensitive)
    const headerKey = req.headers?.['accountkey'] || req.headers?.['x-account-key'] || req.headers?.['x-lta-key'];
    if (headerKey && typeof headerKey === 'string' && headerKey.trim()) {
      return headerKey.trim();
    }
  }

  // 3. Check runtime cache
  if (RUNTIME_KEYS.LTA_ACCOUNT_KEY && RUNTIME_KEYS.LTA_ACCOUNT_KEY.trim()) {
    return RUNTIME_KEYS.LTA_ACCOUNT_KEY.trim();
  }

  // 4. Check process.env
  return (process.env.LTA_ACCOUNT_KEY || '').trim();
}

/**
 * Resolves OneMap AccountKey from query params, request headers, runtime cache, or environment
 */
export function resolveOneMapKey(req) {
  if (req) {
    try {
      const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      const qKey = url.searchParams.get('onemapKey') || url.searchParams.get('token');
      if (qKey && qKey.trim()) return qKey.trim();
    } catch (e) {}

    const authHeader = req.headers?.['authorization'] || req.headers?.['x-onemap-key'];
    if (authHeader && typeof authHeader === 'string' && authHeader.trim()) {
      return authHeader.replace(/^Bearer\s+/i, '').trim();
    }
  }

  if (RUNTIME_KEYS.ONEMAP_ACCOUNT_KEY && RUNTIME_KEYS.ONEMAP_ACCOUNT_KEY.trim()) {
    return RUNTIME_KEYS.ONEMAP_ACCOUNT_KEY.trim();
  }

  return (process.env.ONEMAP_ACCOUNT_KEY || '').trim();
}

/**
 * Saves keys to runtime cache and writes to .env if in writable environment
 */
export function saveKeysToRuntimeAndEnv(ltaKey, onemapKey) {
  if (typeof ltaKey === 'string') {
    RUNTIME_KEYS.LTA_ACCOUNT_KEY = ltaKey.trim();
    process.env.LTA_ACCOUNT_KEY = ltaKey.trim();
  }
  if (typeof onemapKey === 'string') {
    RUNTIME_KEYS.ONEMAP_ACCOUNT_KEY = onemapKey.trim();
    process.env.ONEMAP_ACCOUNT_KEY = onemapKey.trim();
  }

  // Try writing to .env
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const setEnvVar = (content, key, val) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        return content.replace(regex, `${key}="${val}"`);
      }
      return content + `\n${key}="${val}"\n`;
    };

    if (RUNTIME_KEYS.LTA_ACCOUNT_KEY) {
      envContent = setEnvVar(envContent, 'LTA_ACCOUNT_KEY', RUNTIME_KEYS.LTA_ACCOUNT_KEY);
    }
    if (RUNTIME_KEYS.ONEMAP_ACCOUNT_KEY) {
      envContent = setEnvVar(envContent, 'ONEMAP_ACCOUNT_KEY', RUNTIME_KEYS.ONEMAP_ACCOUNT_KEY);
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');
  } catch (err) {
    // If read-only fs (e.g. Vercel serverless), runtime memory persists for invocation lifecycle
  }
}

/**
 * Fetches from LTA DataMall API (datamall2.mytransport.sg)
 */
export async function fetchLTA(req, endpointPath, fallbackData) {
  const accountKey = resolveLTAKey(req);
  const baseUrl = 'https://datamall2.mytransport.sg/ltaodataservice';
  const url = `${baseUrl}/${endpointPath}`;

  if (!accountKey) {
    return {
      status: 'mock_fallback',
      live: false,
      message: 'LTA_ACCOUNT_KEY is not configured yet. Configure your key in the API Health Monitor to stream live data.',
      data: fallbackData
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'accept': 'application/json',
        'User-Agent': 'CivicTransitIntelligence/4.8'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        status: 'error_fallback',
        live: false,
        statusCode: response.status,
        message: response.status === 403 
          ? 'LTA DataMall rejected the AccountKey (HTTP 403 Forbidden). Please verify your AccountKey.'
          : `LTA API returned status ${response.status}: ${errorText.slice(0, 120)}`,
        data: fallbackData
      };
    }

    const json = await response.json();
    return {
      status: 'live',
      live: true,
      source: 'LTA DataMall v2 (Real-Time)',
      recordCount: Array.isArray(json?.value) ? json.value.length : 0,
      timestamp: new Date().toISOString(),
      data: json
    };
  } catch (err) {
    return {
      status: 'error_fallback',
      live: false,
      message: err.name === 'AbortError' ? 'LTA API request timed out (9s)' : err.message,
      data: fallbackData
    };
  }
}

/**
 * Fetches routing geometry & instructions from OneMap API
 */
export async function fetchOneMap(req, start, end, routeType = 'drive', fallbackData) {
  const accountKey = resolveOneMapKey(req);
  const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}`;

  if (!accountKey) {
    return {
      status: 'mock_fallback',
      live: false,
      message: 'ONEMAP_ACCOUNT_KEY is not configured yet. Returning calibrated simulation data.',
      data: fallbackData
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const authHeader = accountKey.startsWith('Bearer ') ? accountKey : `Bearer ${accountKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        status: 'error_fallback',
        live: false,
        statusCode: response.status,
        message: `OneMap API returned status ${response.status}: ${errorText.slice(0, 120)}`,
        data: fallbackData
      };
    }

    const json = await response.json();
    return {
      status: 'live',
      live: true,
      source: 'Singapore OneMap Routing API (Real-Time)',
      timestamp: new Date().toISOString(),
      data: json
    };
  } catch (err) {
    return {
      status: 'error_fallback',
      live: false,
      message: err.name === 'AbortError' ? 'OneMap request timed out' : err.message,
      data: fallbackData
    };
  }
}
