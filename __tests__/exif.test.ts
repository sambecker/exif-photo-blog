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
      expect(formatExposureCompensation(1)).toBe('+1ev');
      expect(formatExposureCompensation(-1)).toBe('-1ev');
      expect(formatExposureCompensation(0)).toBe(undefined);
      expect(formatExposureCompensation(0.25)).toBe('+1/4ev');
      expect(formatExposureCompensation(0.33)).toBe('+1/3ev');
      expect(formatExposureCompensation(0.333)).toBe('+1/3ev');
      expect(formatExposureCompensation(-0.25)).toBe('-1/4ev');
      expect(formatExposureCompensation(-0.33)).toBe('-1/3ev');
      expect(formatExposureCompensation(-0.333)).toBe('-1/3ev');
      expect(formatExposureCompensation(0.5)).toBe('+1/2ev');
      expect(formatExposureCompensation(0.4998458896569944)).toBe('+1/2ev');
      expect(formatExposureCompensation(0.66)).toBe('+2/3ev');
      expect(formatExposureCompensation(0.67)).toBe('+2/3ev');
      expect(formatExposureCompensation(0.015625)).toBe('+1/64ev');
      expect(formatExposureCompensation(-0.015625)).toBe('-1/64ev');
      expect(formatExposureCompensation(1)).toBe('+1ev');
      expect(formatExposureCompensation(1.1)).toBe('+1 1/10ev');
      expect(formatExposureCompensation(-1.1)).toBe('-1 1/10ev');
      expect(formatExposureCompensation(1.7)).toBe('+1 7/10ev');
      expect(formatExposureCompensation(-1.7)).toBe('-1 7/10ev');
      expect(formatExposureCompensation(-1.33)).toBe('-1 1/3ev');
      expect(formatExposureCompensation(1.33)).toBe('+1 1/3ev');
      expect(formatExposureCompensation(1.333)).toBe('+1 1/3ev');
      expect(formatExposureCompensation(1.3333)).toBe('+1 1/3ev');
      expect(formatExposureCompensation(1.5)).toBe('+1 1/2ev');
      expect(formatExposureCompensation(2.5)).toBe('+2 1/2ev');
      expect(formatExposureCompensation(-2.5)).toBe('-2 1/2ev');
      expect(formatExposureCompensation(1.9960938)).toBe('+2ev');
      expect(formatExposureCompensation(-1.9960938)).toBe('-2ev');
      // Ignore long fractions
      expect(formatExposureCompensation(-0.119)).toBe('-0.12ev');
      expect(formatExposureCompensation(-0.112340989)).toBe('-0.11ev');
      expect(formatExposureCompensation(0.119)).toBe('+0.12ev');
      expect(formatExposureCompensation(0.112340989)).toBe('+0.11ev');
      expect(formatExposureCompensation(1.119)).toBe('+1.12ev');
      expect(formatExposureCompensation(1.112340989)).toBe('+1.11ev');
      expect(formatExposureCompensation(-1.119)).toBe('-1.12ev');
      expect(formatExposureCompensation(-1.112340989)).toBe('-1.11ev');
      expect(formatExposureCompensation(1.9595959)).toBe('+1.96ev');
    });
  });
});
