import { handleCors, fetchLTA } from './_utils.js';

const FALLBACK_FLOOD_ALERTS = {
  "odata.metadata": "https://datamall2.mytransport.sg/ltaodataservice/PubFloodAlerts",
  "value": [
    {
      "alertId": "2.49.0.0.702.2-BCM-PUB-EMAS-001",
      "dateTime": new Date().toISOString(),
      "msgType": "Alert",
      "event": "Flood",
      "responseType": "Avoid",
      "urgency": "Immediate",
      "severity": "Minor",
      "expires": new Date(Date.now() + 3600000).toISOString(),
      "senderName": "PUB",
      "headline": "High Water Level / Flash Flood Alert",
      "description": "[HEAVY RAIN WARNING] Water level in canal along Dunearn Road near Bukit Timah canal has exceeded 90%. Avoid low-lying slip roads.",
      "instruction": "Exercise caution when travelling along Bukit Timah corridor",
      "areaDesc": "Dunearn Road / Bukit Timah Canal, Singapore",
      "circle": "1.32550,103.81820 0.05",
      "status": "Actual"
    }
  ]
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const result = await fetchLTA(req, 'PubFloodAlerts', FALLBACK_FLOOD_ALERTS);
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(result));
}
