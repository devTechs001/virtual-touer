/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code
 * @param {string} locale - The locale to use
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a number with commas
 * @param {number} number - The number to format
 * @param {string} locale - The locale to use
 * @returns {string} Formatted number string
 */
export function formatNumber(number, locale = 'en-US') {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Calculate percentage
 * @param {number} value - The value
 * @param {number} total - The total
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Calculate discount price
 * @param {number} originalPrice - Original price
 * @param {number} discountPercent - Discount percentage
 * @returns {number} Discounted price
 */
export function calculateDiscount(originalPrice, discountPercent) {
  return originalPrice - (originalPrice * discountPercent) / 100;
}

/**
 * Calculate total price with tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate percentage
 * @returns {number} Total price with tax
 */
export function calculateTotalWithTax(price, taxRate) {
  return price + (price * taxRate) / 100;
}
