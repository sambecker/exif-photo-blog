/* eslint-disable max-len */
import {
  convertTimestampToNaivePostgresString,
  convertTimestampWithOffsetToPostgresString,
  validatePostgresDateString,
  validateNaivePostgresDateString,
} from '../src/utility/date';

describe('Date utility', () => {
  describe('parses ambiguous timestamps', () => {
    it('iPhone 15 Pro', () => {
      const timestamp = 1704641450;
      const offset = '-06:00';
      expect(convertTimestampWithOffsetToPostgresString(timestamp, offset))
        .toBe('2024-01-07T21:30:50.000Z');
      expect(convertTimestampToNaivePostgresString(timestamp))
        .toBe('2024-01-07 15:30:50');
    });
    it('Fujifilm X-T5', () => {
      const timestamp = 1698086000;
      const offset = '-05:00';
      expect(convertTimestampWithOffsetToPostgresString(timestamp, offset))
        .toBe('2023-10-23T23:33:20.000Z');
      expect(convertTimestampToNaivePostgresString(timestamp))
        .toBe('2023-10-23 18:33:20');
    });
    it('Hasselblad X2D 100C', () => {
      const timestamp = '2023-12-02T16:38:36';
      const offset = '+00:00';
      expect(convertTimestampWithOffsetToPostgresString(timestamp, offset))
        .toBe('2023-12-02T16:38:36.000Z');
      expect(convertTimestampToNaivePostgresString(timestamp))
        .toBe('2023-12-02 16:38:36');
    });
    it('Malformed date string', () => {
      const timestamp = '2024/01a/01 Z';
      expect(convertTimestampWithOffsetToPostgresString(timestamp))
        .toBe(convertTimestampWithOffsetToPostgresString(
          new Date().toISOString(),
        ));
    });
    it('Empty string', () => {
      const timestamp = '             ';
      expect(convertTimestampWithOffsetToPostgresString(timestamp))
        .toBe(convertTimestampWithOffsetToPostgresString(
          new Date().toISOString(),
        ));
    });
  });
  describe('validates date strings', () => {
    it('Correct', () => {
      expect(validatePostgresDateString('2025-01-03T21:00:44.000Z')).toBe(true);
      expect(validateNaivePostgresDateString('2025-01-03 16:00:44')).toBe(true);
    });
    it('Incorrect', () => {
      expect(validatePostgresDateString('2024-01-01')).toBe(false);
      expect(validatePostgresDateString('2025-01-03 16:00:44')).toBe(false);
      expect(validateNaivePostgresDateString('2024-01-01')).toBe(false);
      expect(validatePostgresDateString('2025-01-03T21:00:44.000')).toBe(false);
      expect(validateNaivePostgresDateString('2025-01-03T16:00:44')).toBe(false);
      expect(validatePostgresDateString('2025-01-03T21:00:44.000ZZ')).toBe(false);
      expect(validateNaivePostgresDateString('2025-01-03 16:00:44Z')).toBe(false);
    });
  });
});
