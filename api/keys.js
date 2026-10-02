import { handleCors, resolveLTAKey, resolveOneMapKey, saveKeysToRuntimeAndEnv } from './_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method === 'POST') {
    let body = {};
    try {
      if (typeof req.body === 'object' && req.body !== null) {
        body = req.body;
      } else {
        const raw = await new Promise((resolve) => {
          let chunks = '';
          req.on('data', (c) => (chunks += c));
          req.on('end', () => resolve(chunks));
        });
        body = raw ? JSON.parse(raw) : {};
      }
    } catch (e) {
      body = {};
    }

    const { ltaAccountKey, onemapAccountKey } = body;
    saveKeysToRuntimeAndEnv(ltaAccountKey, onemapAccountKey);

    // Verify LTA key with an immediate live probe
    let probeResult = { tested: false };
    const currentLtaKey = resolveLTAKey(req);

    if (currentLtaKey) {
      try {
        const testRes = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
          headers: {
            'AccountKey': currentLtaKey,
            'accept': 'application/json'
          }
        });
        if (testRes.ok) {
          const json = await testRes.json();
          probeResult = {
            tested: true,
            success: true,
            statusCode: 200,
            recordCount: json?.value?.length || 0,
            message: `Successfully connected to LTA DataMall v2! Fetched ${json?.value?.length || 0} real incidents.`
          };
        } else {
          probeResult = {
            tested: true,
            success: false,
            statusCode: testRes.status,
            message: `LTA DataMall responded with HTTP ${testRes.status}. Please check that your AccountKey is active.`
          };
        }
      } catch (err) {
        probeResult = {
          tested: true,
          success: false,
          message: `Network probe error: ${err.message}`
        };
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      message: 'API keys updated successfully in runtime and environment.',
      probe: probeResult
    }));
    return;
  }

  // GET request - return current status and masked keys
  const ltaKey = resolveLTAKey(req);
  const onemapKey = resolveOneMapKey(req);

  const mask = (k) => {
    if (!k || k.length < 6) return k ? '••••••' : '';
    return k.slice(0, 3) + '••••••••' + k.slice(-3);
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    hasLTAKey: Boolean(ltaKey),
    ltaKeyMasked: mask(ltaKey),
    hasOneMapKey: Boolean(onemapKey),
    onemapKeyMasked: mask(onemapKey)
  }));
}
