const zipCoordinates = {
    '1000AA': { lat: 52.379189, lon: 4.899431 }, // Example: Amsterdam
    '2000BB': { lat: 51.9225, lon: 4.47917 },   // Example: Rotterdam
    '1001AB': { lat: 52.379889, lon: 4.899731 }, // Very close to 1000AA
  };
  
  function calculateDistance(zip1, zip2) {
    if (!zipCoordinates[zip1] || !zipCoordinates[zip2]) {
      throw new Error('One or both zip codes are unknown.');
    }
  
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
  
    const { lat: lat1, lon: lon1 } = zipCoordinates[zip1];
    const { lat: lat2, lon: lon2 } = zipCoordinates[zip2];
  
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // in meters
  
    if (distance < 500) {
      return 'less than 500 meters';
    } else if (distance < 1000) {
      return `${Math.round(distance)} meters`;
    } else {
      return `${(distance / 1000).toFixed(2)} km`;
    }
  }
  
  module.exports = { calculateDistance };