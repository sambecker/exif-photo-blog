import {
  convertNumberToRomanNumeral,
  formatNumberToFraction,
  roundToString,
  roundToNumber,
} from '@/utility/number';

describe('number', () => {
  it('converts to roman numerals', () => {
    expect(convertNumberToRomanNumeral(1)).toBe('I');
    expect(convertNumberToRomanNumeral(2)).toBe('II');
    expect(convertNumberToRomanNumeral(3)).toBe('III');
    expect(convertNumberToRomanNumeral(4)).toBe('IV');
    expect(convertNumberToRomanNumeral(5)).toBe('V');
    expect(convertNumberToRomanNumeral(6)).toBe('VI');
    expect(convertNumberToRomanNumeral(7)).toBe('VII');
    expect(convertNumberToRomanNumeral(8)).toBe('VIII');
    expect(convertNumberToRomanNumeral(9)).toBe('IX');
    expect(convertNumberToRomanNumeral(10)).toBe('X');
  });
  it('formats decimals to fractions', () => {
    expect(formatNumberToFraction(0.1666666)).toBe('+1/6');
    expect(formatNumberToFraction(0.25)).toBe('+1/4');
    expect(formatNumberToFraction(0.3333333)).toBe('+1/3');
    expect(formatNumberToFraction(0.5)).toBe('+1/2');
    expect(formatNumberToFraction(0.6666666)).toBe('+2/3');
    expect(formatNumberToFraction(0.75)).toBe('+3/4');
    expect(formatNumberToFraction(0.8333333)).toBe('+5/6');
    expect(formatNumberToFraction(1.6666666)).toBe('+1 2/3');
    expect(formatNumberToFraction(1.75)).toBe('+1 3/4');
    expect(formatNumberToFraction(10.75)).toBe('+10 3/4');
    expect(formatNumberToFraction(-0.1666666)).toBe('-1/6');
    expect(formatNumberToFraction(-0.25)).toBe('-1/4');
    expect(formatNumberToFraction(-0.3333333)).toBe('-1/3');
    expect(formatNumberToFraction(-0.5)).toBe('-1/2');
    expect(formatNumberToFraction(-0.6666666)).toBe('-2/3');
    expect(formatNumberToFraction(-0.75)).toBe('-3/4');
    expect(formatNumberToFraction(-0.8333333)).toBe('-5/6');
    expect(formatNumberToFraction(-1.6666666)).toBe('-1 2/3');
    expect(formatNumberToFraction(-1.75)).toBe('-1 3/4');
    expect(formatNumberToFraction(-10.75)).toBe('-10 3/4');
  });
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