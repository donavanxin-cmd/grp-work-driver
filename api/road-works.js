import { handleCors, fetchLTA } from './_utils.js';

const FALLBACK_ROAD_WORKS = {
  "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#RoadWorks",
  "value": [
    {
      "EventID": "RMINRM-202610-0106",
      "StartDate": "2026-10-01",
      "EndDate": "2026-12-31",
      "SvcDept": "LAND TRANSPORT AUTHORITY (NSC)",
      "RoadName": "MARYMOUNT ROAD / CTE JUNCTION",
      "Other": "Viaduct launching works for North-South Corridor"
    },
    {
      "EventID": "RMINRM-202610-0214",
      "StartDate": "2026-10-01",
      "EndDate": "2026-10-28",
      "SvcDept": "LAND TRANSPORT AUTHORITY",
      "RoadName": "SELETAR EXPRESSWAY (SLE)",
      "Other": "Routine resurfacing and EMAS signage maintenance"
    },
    {
      "EventID": "RMINRM-202610-0388",
      "StartDate": "2026-10-05",
      "EndDate": "2026-11-15",
      "SvcDept": "PUB - WATER RECLAMATION (NETWORK) DEPT",
      "RoadName": "LORNIE HIGHWAY",
      "Other": "Deep Tunnel Sewerage System shaft connection"
    },
    {
      "EventID": "RMINRM-202610-0442",
      "StartDate": "2026-09-15",
      "EndDate": "2026-10-30",
      "SvcDept": "LAND TRANSPORT AUTHORITY",
      "RoadName": "MARINA COASTAL EXPRESSWAY (MCE)",
      "Other": "Tunnel jet fan and environmental sensor overhaul"
    }
  ]
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const result = await fetchLTA(req, 'RoadWorks', FALLBACK_ROAD_WORKS);
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(result));
}
