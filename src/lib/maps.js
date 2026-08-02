export const MAPS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNmZjRkNWUxZjk5NzRlMDlhYWM1NWM0MGZiODI4MTU2IiwiaCI6Im11cm11cjY0In0=";

export const getRoute = async (startInfo, endInfo) => {
  if (!startInfo || !endInfo) throw new Error("Invalid locations");
  try {
    let p1, p2;

    // Helper to get coordinates
    const getCoords = async (info) => {
      // 1. If it's already an object
      if (info.coords && typeof info.coords.latitude === 'number' && typeof info.coords.longitude === 'number') {
        return info.coords;
      }
      // 2. If it's a string like "48.8, 2.3"
      if (typeof info.coords === 'string' && info.coords.includes(',')) {
        const [lat, lon] = info.coords.split(',').map(s => parseFloat(s.trim()));
        if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
      }
      // 3. Geocode by name
      const cleanName = (info.name || "").split(',')[0].trim();
      if (!cleanName) throw new Error("No valid name to geocode");
      
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1`).then(r => r.json());
      if (!geo.results || geo.results.length === 0) throw new Error(`Geocoding failed for ${cleanName}`);
      return { latitude: geo.results[0].latitude, longitude: geo.results[0].longitude };
    };

    p1 = await getCoords(startInfo);
    p2 = await getCoords(endInfo);
    
    const osrm = await fetch(`https://router.project-osrm.org/route/v1/driving/${p1.longitude},${p1.latitude};${p2.longitude},${p2.latitude}?overview=false`).then(r => r.json());
    
    if (osrm.code !== "Ok") throw new Error("Route completely failed");
    
    const route = osrm.routes[0];
    return {
      distance: (route.distance / 1000).toFixed(1), // km
      duration: Math.round(route.duration / 60), // minutes
      startCoords: p1,
      endCoords: p2
    };
  } catch (error) {
    console.error("Route fetching failed:", error);
    throw error;
  }
};
