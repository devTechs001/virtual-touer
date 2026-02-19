/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
export function validatePassword(password) {
  const result = {
    isValid: true,
    errors: [],
  };

  if (password.length < 8) {
    result.isValid = false;
    result.errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one special character');
  }

  return result;
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} html - HTML to sanitize
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
}

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export function generateRandomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
