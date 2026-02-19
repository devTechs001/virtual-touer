/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale to use
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'en-US') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with time
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale to use
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(date, locale = 'en-US') {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Format a time
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale to use
 * @returns {string} Formatted time string
 */
export function formatTime(date, locale = 'en-US') {
  return new Date(date).toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string} date - The date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}
