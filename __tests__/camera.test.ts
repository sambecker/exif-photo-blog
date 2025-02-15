import { Camera, formatCameraText } from '@/camera';

const APPLE     : Camera = { make: 'Apple', model: 'iPhone 11 Pro' };
const APPLE_01  : Camera = { make: 'Apple', model: 'iPhone 11' };
const APPLE_02  : Camera = { make: 'Apple', model: 'iPhone 15 Pro Max' };
const FUJIFILM  : Camera = { make: 'Fujifilm', model: 'X-T5' };
const CANON     : Camera = { make: 'Canon', model: 'Canon EOS 800D' };
const NIKON     : Camera = { make: 'Nikon Corporation', model: 'Nikon D7000' };
const RICOH     : Camera = {
  make: 'RICOH IMAGING COMPANY, LTD.',
  model: 'RICOH GR III',
};

describe('Camera', () => {
  it('labels full text correctly', () => {
    expect(formatCameraText(APPLE)).toBe('iPhone 11 Pro');
    expect(formatCameraText(APPLE, 'long')).toBe('Apple iPhone 11 Pro');
    expect(formatCameraText(APPLE, 'medium')).toBe('iPhone 11 Pro');
    expect(formatCameraText(APPLE, 'short')).toBe('11 Pro');
    expect(formatCameraText(FUJIFILM)).toBe('Fujifilm X-T5');
    expect(formatCameraText(CANON)).toBe('Canon EOS 800D');
    expect(formatCameraText(NIKON, 'long'))
      .toBe('Nikon Corporation Nikon D7000');
    expect(formatCameraText(NIKON)).toBe('Nikon D7000');
    expect(formatCameraText(RICOH)).toBe('RICOH GR III');
  });
  it('labels models correctly', () => {
    expect(formatCameraText(APPLE, 'medium')).toBe('iPhone 11 Pro');
    expect(formatCameraText(APPLE, 'short')).toBe('11 Pro');
    expect(formatCameraText(APPLE_01, 'short')).toBe('iPhone 11');
    expect(formatCameraText(APPLE_02, 'short')).toBe('15 Pro Max');
    expect(formatCameraText(FUJIFILM, 'short')).toBe('X-T5');
    expect(formatCameraText(RICOH, 'short')).toBe('GR III');
    expect(formatCameraText(NIKON, 'short')).toBe('D7000');
  });
});

