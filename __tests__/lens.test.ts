/* eslint-disable max-len */
import { formatLensText, Lens } from '@/lens';

const IPHONE_15_PRO_FRONT: Lens = { make: 'Apple', model: 'iPhone 15 Pro front TrueDepth camera 2.69mm f/1.9' };

describe('Lens', () => {
  it('correctly formats iPhone lenses', () => {
    expect(formatLensText(IPHONE_15_PRO_FRONT)).toBe('Front Camera');
  });
});
