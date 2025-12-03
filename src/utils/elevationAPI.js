// Fetch elevation data from Open-Elevation API

export async function fetchElevation(lat, lng) {
  try {
    const response = await fetch(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
    );
    const data = await response.json();
    return data.results[0]?.elevation || 0;
  } catch (error) {
    console.error('Elevation API error:', error);
    return 0; // Return 0 if API fails
  }
}

// Fetch elevation profile between two towers
export async function fetchElevationProfile(tower1, tower2, numPoints = 10) {
  const elevations = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = tower1.lat + (tower2.lat - tower1.lat) * t;
    const lng = tower1.lng + (tower2.lng - tower1.lng) * t;
    
    const elevation = await fetchElevation(lat, lng);
    elevations.push({ lat, lng, elevation });
  }
  
  return elevations;
}
