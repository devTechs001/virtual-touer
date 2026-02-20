import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime } from '../dateUtils';
import { formatNumber, formatCurrency, calculatePercentage } from '../numberUtils';
import { isValidEmail, truncateText, validatePassword } from '../stringUtils';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toContain('2024');
    });

    it('returns formatted date for valid dates', () => {
      const date = new Date();
      expect(formatDate(date)).toBeTruthy();
    });
  });

  describe('formatDateTime', () => {
    it('formats date with time', () => {
      const date = new Date('2024-01-15T10:30:00');
      expect(formatDateTime(date)).toBeTruthy();
    });
  });
});

describe('Number Utilities', () => {
  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('handles decimals', () => {
      expect(formatNumber(1000.5, 2)).toBe('1,000.5');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles negative values', () => {
      expect(formatCurrency(-50)).toBe('-$50.00');
    });
  });

  describe('calculatePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculatePercentage(50, 100)).toBe(50);
      expect(calculatePercentage(25, 100)).toBe(25);
    });

    it('handles edge cases', () => {
      expect(calculatePercentage(0, 100)).toBe(0);
      expect(calculatePercentage(50, 0)).toBe(0);
    });
  });
});

describe('String Utilities', () => {
  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('handles edge cases', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('truncates long strings', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long ...');
    });

    it('does not truncate short strings', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 50)).toBe('Short text');
    });

    it('handles edge cases', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('uses custom suffix', () => {
      const text = 'This is a long text';
      expect(truncateText(text, 10, ' [more]')).toBe('This is a  [more]');
    });
  });

  describe('validatePassword', () => {
    it('validates strong password', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects weak password', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('checks minimum length', () => {
      const result = validatePassword('Short1!');
      expect(result.errors).toContain('Password must be at least 8 characters');
    });
  });
});
