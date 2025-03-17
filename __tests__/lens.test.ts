/* eslint-disable max-len */
import { formatLensText, Lens } from '@/lens';

const IPHONE_15_PRO_FRONT: Lens = { make: 'Apple', model: 'iPhone 15 Pro front TrueDepth camera 2.69mm f/1.9' };
const IPHONE_15_PRO_BACK_WIDE: Lens = { make: 'Apple', model: 'iPhone 15 Pro back triple camera 6.765mm f/2.2' };
const IPHONE_15_PRO_BACK_MAIN: Lens = { make: 'Apple', model: 'iPhone 15 Pro back triple camera 6.765mm f/1.78' };
const IPHONE_15_PRO_BACK_TELEPHOTO: Lens = { make: 'Apple', model: 'iPhone 15 Pro back triple camera 6.765mm f/2.8' };

describe('Lens', () => {
  it('correctly formats iPhone lenses', () => {
    expect(formatLensText(IPHONE_15_PRO_FRONT)).toBe('15 Pro front');
    expect(formatLensText(IPHONE_15_PRO_BACK_WIDE)).toBe('15 Pro Wide (6.765mm)');
    expect(formatLensText(IPHONE_15_PRO_BACK_MAIN)).toBe('15 Pro Main (6.765mm)');
    expect(formatLensText(IPHONE_15_PRO_BACK_TELEPHOTO)).toBe('15 Pro Telephoto (6.765mm)');
  });
});
