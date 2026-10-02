import { handleCors, fetchLTA } from './_utils.js';

const FALLBACK_SPEED_BANDS = {
  "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#TrafficSpeedBands",
  "lastUpdatedTime": new Date().toISOString(),
  "value": [
    {
      "LinkID": "103000001",
      "RoadName": "CENTRAL EXPRESSWAY (CTE)",
      "RoadCategory": "A",
      "SpeedBand": 4,
      "MinimumSpeed": "30",
      "MaximumSpeed": "39",
      "StartLon": "103.8482",
      "StartLat": "1.3195",
      "EndLon": "103.8441",
      "EndLat": "1.3090"
    },
    {
      "LinkID": "103000002",
      "RoadName": "SELETAR EXPRESSWAY (SLE)",
      "RoadCategory": "A",
      "SpeedBand": 3,
      "MinimumSpeed": "20",
      "MaximumSpeed": "29",
      "StartLon": "103.7925",
      "StartLat": "1.4182",
      "EndLon": "103.8150",
      "EndLat": "1.3980"
    },
    {
      "LinkID": "103000003",
      "RoadName": "PAN ISLAND EXPRESSWAY (PIE)",
      "RoadCategory": "A",
      "SpeedBand": 7,
      "MinimumSpeed": "60",
      "MaximumSpeed": "69",
      "StartLon": "103.7745",
      "StartLat": "1.3412",
      "EndLon": "103.8120",
      "EndLat": "1.3320"
    },
    {
      "LinkID": "103000004",
      "RoadName": "AYER RAJAH EXPRESSWAY (AYE)",
      "RoadCategory": "A",
      "SpeedBand": 6,
      "MinimumSpeed": "50",
      "MaximumSpeed": "59",
      "StartLon": "103.7310",
      "StartLat": "1.3180",
      "EndLon": "103.7650",
      "EndLat": "1.3020"
    },
    {
      "LinkID": "103000005",
      "RoadName": "KENT ROAD",
      "RoadCategory": "E",
      "SpeedBand": 3,
      "MinimumSpeed": "20",
      "MaximumSpeed": "29",
      "StartLon": "103.85298052044503",
      "StartLat": "1.3170142376560023",
      "EndLon": "103.85259882242372",
      "EndLat": "1.3166840028663076"
    }
  ]
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const result = await fetchLTA(req, 'TrafficSpeedBands', FALLBACK_SPEED_BANDS);
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(result));
}
