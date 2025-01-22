const { calculateCo2Saved } = require('./emissionPrevention');

describe('CO2 emissions prevented by not throwing away food', () => {
  test('should calculate CO2 saved for kaas with 10 kg', () => {
    const result = calculateCo2Saved('kaas', 10);
    expect(result).toBe(50); // 10 kg * 5.0 (kaas)
  });

  test('should throw error for unknown product', () => {
    expect(() => calculateCo2Saved('unknownProduct', 5)).toThrow('Product unknownProduct is niet bekend.');
  });
});