import { Camera, formatCameraText } from '@/camera';

const APPLE     : Camera = { make: 'Apple', model: 'iPhone 11 Pro' };
const APPLE_01  : Camera = { make: 'Apple', model: 'iPhone 11' };
const APPLE_02  : Camera = { make: 'Apple', model: 'iPhone 15 Pro Max' };
const FUJIFILM  : Camera = { make: 'Fujifilm', model: 'X-T5' };
const CANON     : Camera = { make: 'Canon', model: 'Canon EOS 800D' };
const NIKON     : Camera = {
  make: 'Nikon Corporation',
  model: 'Nikon D7000',
};

describe('Camera', () => {
  it('labels full text correctly', () => {
    expect(formatCameraText(APPLE)).toBe('iPhone 11 Pro');
    expect(formatCameraText(APPLE, 'always')).toBe('Apple iPhone 11 Pro');
    expect(formatCameraText(APPLE, 'if-not-apple')).toBe('iPhone 11 Pro');
    expect(formatCameraText(APPLE, 'never')).toBe('iPhone 11 Pro');
    expect(formatCameraText(FUJIFILM)).toBe('Fujifilm X-T5');
    expect(formatCameraText(CANON)).toBe('Canon EOS 800D');
    expect(formatCameraText(NIKON)).toBe('Nikon D7000');
  });
  it('labels models correctly', () => {
    expect(formatCameraText(APPLE, 'never')).toBe('iPhone 11 Pro');
    expect(formatCameraText(APPLE, 'never', true)).toBe('11 Pro');
    expect(formatCameraText(APPLE_01, 'never', true)).toBe('iPhone 11');
    expect(formatCameraText(APPLE_02, 'never', true)).toBe('15 Pro Max');
  });
});

