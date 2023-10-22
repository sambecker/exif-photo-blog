import { formatExposureCompensation, formatExposureTime } from '@/utility/exif';

describe('EXIF', () => {
  describe('formats', () => {
    it('exposure time', () => {
      expect(formatExposureTime(0)).toBe(undefined);
      expect(formatExposureTime(undefined)).toBe(undefined);
      expect(formatExposureTime(0.5)).toBe('1/2s');
      expect(formatExposureTime(0.1)).toBe('1/10s');
      expect(formatExposureTime(0.01)).toBe('1/100s');
      expect(formatExposureTime(1)).toBe('1s');
      expect(formatExposureTime(1.5)).toBe('1.5s');
    });
    it('exposure compensation', () => {
      expect(formatExposureCompensation(-1)).toBe('-1ev');
      expect(formatExposureCompensation(0)).toBe(undefined);
      expect(formatExposureCompensation(0.33)).toBe('+1/3ev');
      expect(formatExposureCompensation(0.333)).toBe('+1/3ev');
      expect(formatExposureCompensation(0.5)).toBe('+1/2ev');
      expect(formatExposureCompensation(0.66)).toBe('+2/3ev');
      expect(formatExposureCompensation(0.67)).toBe('+2/3ev');
      expect(formatExposureCompensation(0.015625)).toBe('+1/64ev');
      expect(formatExposureCompensation(-0.015625)).toBe('-1/64ev');
      expect(formatExposureCompensation(1)).toBe('+1ev');
      expect(formatExposureCompensation(1.5)).toBe('+1 1/2ev');
      expect(formatExposureCompensation(1.9960938)).toBe('+2ev');
    });
  });
});
