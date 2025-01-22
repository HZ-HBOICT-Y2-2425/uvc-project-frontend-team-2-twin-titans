const { calculateDistance } = require('./distanceCalculator');

describe('Distance calculation between zip codes', () => {
  test('should calculate distance between 1000AA and 2000BB in km', () => {
    const result = calculateDistance('1000AA', '2000BB');
    expect(result).toBe('58.32 km'); // Approximate distance between Amsterdam and Rotterdam
  });

  test('should return "less than 500 meters" for nearby zip codes', () => {
    const result = calculateDistance('1000AA', '1001AB');
    expect(result).toBe('less than 500 meters'); // These zip codes are very close
  });

  test('should throw error for unknown zip codes', () => {
    expect(() => calculateDistance('unknownZip', '1000AA')).toThrow('One or both zip codes are unknown.');
  });
});