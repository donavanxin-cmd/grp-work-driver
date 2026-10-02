import { handleCors, fetchLTA } from './_utils.js';

const FALLBACK_TRAFFIC_INCIDENTS = {
  "odata.metadata": "http://datamall2.mytransport.sg/ltaodataservice/$metadata#IncidentSet",
  "value": [
    {
      "Type": "Breakdown",
      "Latitude": 1.418290,
      "Longitude": 103.792500,
      "Message": "(02/10)09:22 Vehicle Breakdown on SLE (towards CTE) after Woodlands Ave 2. Avoid lane 2."
    },
    {
      "Type": "Heavy Traffic",
      "Latitude": 1.319500,
      "Longitude": 103.848200,
      "Message": "(02/10)09:18 Incident on CTE (towards AYE) after Moulmein Rd."
    },
    {
      "Type": "Breakdown",
      "Latitude": 1.348600,
      "Longitude": 103.873200,
      "Message": "(02/10)09:08 Vehicle Breakdown on Bartley Road (towards Tampines) after Upper Serangoon Road. Avoid lane 2."
    },
    {
      "Type": "Accident",
      "Latitude": 1.325100,
      "Longitude": 103.636400,
      "Message": "(02/10)08:52 Accident on AYE (towards Tuas) after Tuas West Rd. Avoid lane 2."
    },
    {
      "Type": "Roadwork",
      "Latitude": 1.390923508426507,
      "Longitude": 103.76543045742648,
      "Message": "(02/10)08:34 Heavy Traffic on KJE (towards BKE) at BKE (Woodlands) Exit. Avoid lane 2."
    }
  ]
};

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  const result = await fetchLTA(req, 'TrafficIncidents', FALLBACK_TRAFFIC_INCIDENTS);
  
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(result));
}
