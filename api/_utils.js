/**
 * Helper utility for LTA DataMall and OneMap API integration
 */

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');
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
 * Fetches from LTA DataMall API (datamall2.mytransport.sg)
 * Uses LTA_ACCOUNT_KEY environment variable.
 */
export async function fetchLTA(endpointPath, fallbackData) {
  const accountKey = process.env.LTA_ACCOUNT_KEY;
  const baseUrl = 'https://datamall2.mytransport.sg/ltaodataservice';
  const url = `${baseUrl}/${endpointPath}`;

  if (!accountKey) {
    return {
      status: 'mock_fallback',
      message: 'LTA_ACCOUNT_KEY is not configured yet. Returning calibrated simulation data.',
      data: fallbackData
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'AccountKey': accountKey,
        'accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      return {
        status: 'error_fallback',
        statusCode: response.status,
        message: `LTA API returned status ${response.status}: ${errorText.slice(0, 100)}`,
        data: fallbackData
      };
    }

    const json = await response.json();
    return {
      status: 'live',
      source: 'LTA DataMall v2',
      timestamp: new Date().toISOString(),
      data: json
    };
  } catch (err) {
    return {
      status: 'error_fallback',
      message: err.name === 'AbortError' ? 'LTA API request timed out (8s)' : err.message,
      data: fallbackData
    };
  }
}

/**
 * Fetches routing geometry & instructions from OneMap API
 * Uses ONEMAP_ACCOUNT_KEY environment variable.
 */
export async function fetchOneMap(start, end, routeType = 'drive', fallbackData) {
  const accountKey = process.env.ONEMAP_ACCOUNT_KEY;
  const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}`;

  if (!accountKey) {
    return {
      status: 'mock_fallback',
      message: 'ONEMAP_ACCOUNT_KEY is not configured yet. Returning calibrated simulation data.',
      data: fallbackData
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Support Bearer token or plain key in Authorization header
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
        statusCode: response.status,
        message: `OneMap API returned status ${response.status}: ${errorText.slice(0, 100)}`,
        data: fallbackData
      };
    }

    const json = await response.json();
    return {
      status: 'live',
      source: 'Singapore OneMap Routing API',
      timestamp: new Date().toISOString(),
      data: json
    };
  } catch (err) {
    return {
      status: 'error_fallback',
      message: err.name === 'AbortError' ? 'OneMap request timed out' : err.message,
      data: fallbackData
    };
  }
}
