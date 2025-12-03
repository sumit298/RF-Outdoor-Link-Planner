// RF Link Planner Calculations

// Calculate distance between two lat/lng points using Haversine formula
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Calculate wavelength from frequency
export function calculateWavelength(frequencyGHz) {
  const c = 3e8; // Speed of light in m/s
  const frequencyHz = frequencyGHz * 1e9; // Convert GHz to Hz
  return c / frequencyHz; // Wavelength in meters
}

// Calculate Fresnel zone radius at a point
export function calculateFresnelRadius(wavelength, d1, d2) {
  if (d1 <= 0 || d2 <= 0) return 0;
  return Math.sqrt((wavelength * d1 * d2) / (d1 + d2));
}

// Calculate bearing between two points
function calculateBearing(lat1, lng1, lat2, lng2) {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return (θ * 180) / Math.PI;
}

// Generate ellipse points for Fresnel zone visualization
export function generateFresnelEllipse(tower1, tower2, frequencyGHz, numPoints = 50) {
  const distance = calculateDistance(tower1.lat, tower1.lng, tower2.lat, tower2.lng);
  const wavelength = calculateWavelength(frequencyGHz);
  
  // Maximum Fresnel radius at midpoint
  const maxRadius = calculateFresnelRadius(wavelength, distance / 2, distance / 2);
  
  const bearing = calculateBearing(tower1.lat, tower1.lng, tower2.lat, tower2.lng);
  const perpBearing = bearing + 90;
  
  const points = [];
  
  // Generate ellipse points
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    
    // Position along the link (0 to 1)
    const t = (Math.cos(angle) + 1) / 2;
    
    // Interpolate position between towers
    const lat = tower1.lat + (tower2.lat - tower1.lat) * t;
    const lng = tower1.lng + (tower2.lng - tower1.lng) * t;
    
    // Calculate Fresnel radius at this point
    const d1 = distance * t;
    const d2 = distance * (1 - t);
    const radius = calculateFresnelRadius(wavelength, d1, d2);
    
    // Offset perpendicular to link
    const offset = radius * Math.sin(angle);
    const offsetLat = (offset * Math.cos((perpBearing * Math.PI) / 180)) / 111320;
    const offsetLng = (offset * Math.sin((perpBearing * Math.PI) / 180)) / (111320 * Math.cos((lat * Math.PI) / 180));
    
    points.push([lat + offsetLat, lng + offsetLng]);
  }
  
  return points;
}
