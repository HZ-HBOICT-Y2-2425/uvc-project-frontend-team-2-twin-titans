function calculateCo2Saved(product, weight) {
    const productEmissionsPerKg = {
      kaas: 5.0, // CO2 emission per kg
      melk: 1.9,
      aardappelen: 0.7,
      vlees: 27.0,
      groenten: 0.3,
    };
  
    // eslint-disable-next-line no-prototype-builtins
    if (!productEmissionsPerKg.hasOwnProperty(product)) {
      throw new Error(`Product ${product} is niet bekend.`);
    }
  
    const co2Saved = weight * productEmissionsPerKg[product]; // weight in kg
    return co2Saved;
  }
  
  module.exports = { calculateCo2Saved };