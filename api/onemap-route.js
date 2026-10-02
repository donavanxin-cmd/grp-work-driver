import { handleCors, fetchOneMap } from './_utils.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  // Extract query parameters from URL
  const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
  const start = url.searchParams.get('start') || '1.4382,103.7890'; // Woodlands default
  const end = url.searchParams.get('end') || '1.2792,103.8540';     // Marina Bay default
  const routeType = url.searchParams.get('routeType') || 'drive';

  const fallbackOneMapRoute = {
    "status_message": "Found route between points",
    "route_geometry": "_v~g@_l_yR_A?wB|CqH?mG_Ak@mF_Bk@oE_@qJ?uK",
    "status": 0,
    "route_instructions": [
      [
        "Start",
        "Woodlands Ave 2",
        1200,
        start,
        180,
        "1.2km",
        "South",
        "South",
        routeType,
        "Head South on Woodlands Ave 2 towards SLE"
      ],
      [
        "Merge",
        "Seletar Expressway (SLE)",
        8400,
        "1.4182,103.7925",
        480,
        "8.4km",
        "South-East",
        "South",
        routeType,
        "Merge onto SLE (towards CTE / City)"
      ],
      [
        "Continue",
        "Central Expressway (CTE)",
        11200,
        "1.3780,103.8540",
        960,
        "11.2km",
        "South",
        "South",
        routeType,
        "Continue onto CTE into CTE Tunnel towards Marina Boulevard"
      ],
      [
        "Exit",
        "Marina Boulevard",
        1800,
        "1.2820,103.8530",
        240,
        "1.8km",
        "South",
        "South-West",
        routeType,
        "Take exit into Marina Boulevard / MBFC Tower 2"
      ],
      [
        "Arrived",
        "Marina Bay Financial Centre",
        0,
        end,
        0,
        "0m",
        "South",
        "South",
        routeType,
        "You Have Arrived At Your Destination, On The Left"
      ]
    ],
    "route_name": [
      "SLE / CTE Expressway Corridor"
    ],
    "route_summary": {
      "start_point": start,
      "end_point": end,
      "total_time": 2040,
      "total_distance": 24800
    }
  };

  const result = await fetchOneMap(start, end, routeType, fallbackOneMapRoute);

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(result));
}
