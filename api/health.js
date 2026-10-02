import { handleCors, resolveLTAKey, resolveOneMapKey } from './_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const ltaKey = resolveLTAKey(req);
  const onemapKey = resolveOneMapKey(req);

  const hasLTA = Boolean(ltaKey && ltaKey.length > 0);
  const hasOneMap = Boolean(onemapKey && onemapKey.length > 0);

  // Perform live connectivity test if key is supplied
  let ltaProbe = {
    tested: false,
    liveConnected: false,
    message: 'LTA_ACCOUNT_KEY missing. Running in simulation fallback mode.'
  };

  if (hasLTA) {
    try {
      const probeRes = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
        headers: {
          'AccountKey': ltaKey,
          'accept': 'application/json'
        }
      });

      if (probeRes.ok) {
        const json = await probeRes.json();
        const count = json?.value?.length || 0;
        ltaProbe = {
          tested: true,
          liveConnected: true,
          statusCode: 200,
          recordCount: count,
          message: `Active! Successfully streaming real-time LTA data (${count} live incidents currently reported).`
        };
      } else {
        ltaProbe = {
          tested: true,
          liveConnected: false,
          statusCode: probeRes.status,
          message: probeRes.status === 403
            ? 'LTA rejected AccountKey (HTTP 403 Forbidden). Ensure your DataMall account key is approved.'
            : `LTA responded with HTTP ${probeRes.status}`
        };
      }
    } catch (err) {
      ltaProbe = {
        tested: true,
        liveConnected: false,
        message: `Connection error: ${err.message}`
      };
    }
  }

  const overallStatus = ltaProbe.liveConnected
    ? 'live_operational'
    : hasLTA
    ? 'key_rejected_or_degraded'
    : 'simulation_fallback';

  const healthData = {
    status: overallStatus,
    liveDataStreaming: ltaProbe.liveConnected,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    ltaDataMall: {
      accountKeyPresent: hasLTA,
      probe: ltaProbe
    },
    oneMap: {
      accountKeyPresent: hasOneMap,
      status: hasOneMap ? 'configured' : 'missing'
    },
    endpoints: [
      {
        path: '/api/traffic-incidents',
        description: 'LTA Traffic Incident Status & EMAS Dispatches',
        upstream: 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents',
        mode: ltaProbe.liveConnected ? 'live' : 'simulation'
      },
      {
        path: '/api/travel-times',
        description: 'LTA Estimated Expressway Travel Times',
        upstream: 'https://datamall2.mytransport.sg/ltaodataservice/EstTravelTimes',
        mode: ltaProbe.liveConnected ? 'live' : 'simulation'
      },
      {
        path: '/api/flood-alerts',
        description: 'PUB Flash Flood Reports & Water Level Sensors',
        upstream: 'https://datamall2.mytransport.sg/ltaodataservice/PubFloodAlerts',
        mode: ltaProbe.liveConnected ? 'live' : 'simulation'
      },
      {
        path: '/api/road-works',
        description: 'LTA Statutory Road Works & Maintenance Events',
        upstream: 'https://datamall2.mytransport.sg/ltaodataservice/RoadWorks',
        mode: ltaProbe.liveConnected ? 'live' : 'simulation'
      },
      {
        path: '/api/traffic-speed-bands',
        description: 'LTA Expressway Link Speed Bands & Velocity Telemetry',
        upstream: 'https://datamall2.mytransport.sg/ltaodataservice/TrafficSpeedBands',
        mode: ltaProbe.liveConnected ? 'live' : 'simulation'
      },
      {
        path: '/api/onemap-route',
        description: 'Singapore OneMap Multi-Modal Driving Routing Engine',
        upstream: 'https://www.onemap.gov.sg/api/public/routingsvc/route',
        mode: hasOneMap ? 'live' : 'simulation'
      }
    ],
    configurationGuide: {
      vercel: 'In Vercel Dashboard -> Project Settings -> Environment Variables, add LTA_ACCOUNT_KEY and ONEMAP_ACCOUNT_KEY.',
      inApp: 'Or use the API Diagnostics modal in the app to test and save your keys immediately in runtime.'
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(healthData, null, 2));
}
