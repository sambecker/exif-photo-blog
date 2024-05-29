import { roundToString, roundToNumber } from '@/utility/number';

describe('number', () => {
  describe('rounds to a', () => {
    it('string', () => {
      expect(roundToString(1.2345, 1)).toBe('1.2');
      expect(roundToString(1.2345, 2)).toBe('1.23');
      expect(roundToString(1.2355, 2)).toBe('1.24');
      expect(roundToString(1.2355, 3)).toBe('1.236');
      expect(roundToString(1.78, 1)).toBe('1.8');
      expect(roundToString(1.0, 1, false)).toBe('1');
      expect(roundToString(1.0, 1, true)).toBe('1.0');
    });
    it('number', () => {
      expect(roundToNumber(1.2345, 1)).toBe(1.2);
      expect(roundToNumber(1.2345, 2)).toBe(1.23);
      expect(roundToNumber(1.2355, 2)).toBe(1.24);
      expect(roundToNumber(1.2355, 3)).toBe(1.236);
      expect(roundToNumber(1.78, 1)).toBe(1.8);
      expect(roundToNumber(1.0, 1, false)).toBe(1);
      expect(roundToNumber(1.0, 1, true)).toBe(1);
    });
  });
});