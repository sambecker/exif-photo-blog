/* eslint-disable max-len */
import { formatLensText, Lens } from '@/lens';

const IPHONE_15_PRO_FRONT: Lens = { make: 'Apple', model: 'iPhone 15 Pro front TrueDepth camera 2.69mm f/1.9' };
const IPHONE_15_PRO_BACK_WIDE: Lens = { make: 'Apple', model: 'iPhone 15 Pro back triple camera 6.765mm f/2.2' };
const IPHONE_15_PRO_BACK_MAIN: Lens = { make: 'Apple', model: 'iPhone 15 Pro back triple camera 6.765mm f/1.78' };
const IPHONE_15_PRO_BACK_TELEPHOTO: Lens = { make: 'Apple', model: 'iPhone 15 Pro back triple camera 6.765mm f/2.8' };
const IPHONE_14_PRO_BACK_WIDE_NO_MAKE: Lens = { model: 'iPhone 14 Pro back dual wide camera 6.86mm f/1.78' };
const IPHONE_12_PRO_MAX_BACK_WIDE_NO_MAKE: Lens = { model: 'iPhone 12 Pro Max back dual camera 7.5mm f/2.2' };
const IPHONE_12_PRO_MAX_BACK_TELEPHOTO_NO_MAKE: Lens = { model: 'iPhone 12 Pro Max back triple camera 5.1mm f/1.6' };

const PIXEL_8_PRO_BACK: Lens = { make: 'Google', model: 'Pixel 8 Pro back camera 6.9mm f/1.68' };
const PIXEL_8_PRO_BACK_NO_MAKE: Lens = { model: 'Pixel 8 Pro back camera 6.9mm f/1.68' };
const PIXEL_6A_BACK: Lens = { make: 'Google', model: 'Pixel 6a back camera 2.35mm f/2.2' };

describe('Lens', () => {
  describe('correctly formats', () => {
    it('iPhone lenses', () => {
      expect(formatLensText(IPHONE_15_PRO_FRONT)).toBe('15 Pro front');
      expect(formatLensText(IPHONE_15_PRO_FRONT, 'long')).toBe('Apple iPhone 15 Pro front TrueDepth camera 2.69mm f/1.9');
      expect(formatLensText(IPHONE_15_PRO_BACK_WIDE)).toBe('15 Pro Wide (6.765mm)');
      expect(formatLensText(IPHONE_15_PRO_BACK_MAIN)).toBe('15 Pro Main (6.765mm)');
      expect(formatLensText(IPHONE_15_PRO_BACK_TELEPHOTO)).toBe('15 Pro Telephoto (6.765mm)');
      expect(formatLensText(IPHONE_14_PRO_BACK_WIDE_NO_MAKE)).toBe('14 Pro Main (6.86mm)');
      expect(formatLensText(IPHONE_12_PRO_MAX_BACK_WIDE_NO_MAKE)).toBe('12 Pro Max Telephoto (7.5mm)');
      expect(formatLensText(IPHONE_12_PRO_MAX_BACK_TELEPHOTO_NO_MAKE)).toBe('12 Pro Max Main (5.1mm)');
    });
    it('Pixel lenses', () => {
      expect(formatLensText(PIXEL_8_PRO_BACK, 'medium')).toBe('Pixel 8 Pro Back (6.9mm)');
      expect(formatLensText(PIXEL_8_PRO_BACK_NO_MAKE, 'medium')).toBe('Pixel 8 Pro Back (6.9mm)');
      expect(formatLensText(PIXEL_8_PRO_BACK, 'short')).toBe('Back Camera (6.9mm)');
      expect(formatLensText(PIXEL_6A_BACK, 'medium')).toBe('Pixel 6a Back (2.35mm)');
      expect(formatLensText(PIXEL_6A_BACK, 'short')).toBe('Back Camera (2.35mm)');
    });
  });
});
