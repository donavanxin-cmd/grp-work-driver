import { handleCors, fetchLTA } from './_utils.js';

const FALLBACK_EST_TRAVEL_TIMES = {
  "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#EstTravelTimes",
  "value": [
    {
      "Name": "SLE",
      "Direction": 1,
      "FarEndPoint": "CTE INTERCHANGE",
      "StartPoint": "WOODLANDS AVE 2",
      "EndPoint": "MANDAI FLYOVER",
      "EstTime": 6
    },
    {
      "Name": "CTE",
      "Direction": 1,
      "FarEndPoint": "AYE / MCE",
      "StartPoint": "BRADDELL FLYOVER",
      "EndPoint": "MOULMEIN RD",
      "EstTime": 14
    },
    {
      "Name": "CTE",
      "Direction": 1,
      "FarEndPoint": "AYE / MCE",
      "StartPoint": "MOULMEIN RD",
      "EndPoint": "CTE TUNNEL (SHEARES)",
      "EstTime": 8
    },
    {
      "Name": "AYE",
      "Direction": 1,
      "FarEndPoint": "TUAS CHECKPOINT",
      "StartPoint": "AYE/MCE INTERCHANGE",
      "EndPoint": "TELOK BLANGAH RD",
      "EstTime": 2
    },
    {
      "Name": "AYE",
      "Direction": 1,
      "FarEndPoint": "TUAS CHECKPOINT",
      "StartPoint": "TELOK BLANGAH RD",
      "EndPoint": "LOWER DELTA RD",
      "EstTime": 1
    },
    {
      "Name": "PIE",
      "Direction": 2,
      "FarEndPoint": "CHANGI AIRPORT",
      "StartPoint": "JALAN ANAK BUKIT",
      "EndPoint": "MOUNT PLEASANT",
      "EstTime": 7
    }
  ]
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const result = await fetchLTA(req, 'EstTravelTimes', FALLBACK_EST_TRAVEL_TIMES);
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(result));
}
