export const CO2_PER_SCORE_POINT = 0.15;

export const CONDITION_SCORES = {
  New: 30,
  'Like New': 70,
  Good: 85,
  Fair: 95,
};

export const getSustainabilityScore = (condition) => {
  return CONDITION_SCORES[condition] ?? 50;
};

export const getCO2Saved = (sustainabilityScore) => {
  return sustainabilityScore * CO2_PER_SCORE_POINT;
};

export const getProductCO2Saved = (product) => {
  if (!product) return 0;

  const score =
    product.sustainabilityScore ??
    getSustainabilityScore(product.condition);

  return getCO2Saved(score);
};

export const getCartCO2Saved = (items) => {
  return items.reduce((total, item) => {
    return total + getProductCO2Saved(item.product);
  }, 0);
};

export const formatCO2 = (amount) => {
  return `${amount.toFixed(1)}kg`;
};