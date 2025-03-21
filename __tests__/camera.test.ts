import { Camera, formatCameraText } from '@/camera';
import { MAKE_SONY } from '@/platforms/sony';

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

export const SONY_CAMERAS = {
  'SONY ILCE-1M2': 'Sony A1 II',
  'SONY ILCE-1': 'Sony A1',
  'SONY ILCE-9M3': 'Sony A9 III',
  'SONY ILCE-9M2': 'Sony A9 II',
  'SONY ILCE-9': 'Sony A9',
  'SONY ILCE-7RM5': 'Sony A7R V',
  'SONY ILCE-7RM4': 'Sony A7R IV',
  'SONY ILCE-7RM4A': 'Sony A7R IVA',
  'SONY ILCE-7RM3': 'Sony A7R III',
  'SONY ILCE-7RM3A': 'Sony A7R IIIA',
  'SONY ILCE-7RM2': 'Sony A7R II',
  'SONY ILCE-7R': 'Sony A7R',
  'SONY ILCE-7SM3': 'Sony A7S III',
  'SONY ILCE-7SM2': 'Sony A7S II',
  'SONY ILCE-7S': 'Sony A7S',
  'SONY ILCE-7M4': 'Sony A7 IV',
  'SONY ILCE-7M3': 'Sony A7 III',
  'SONY ILCE-7M2': 'Sony A7 II',
  'SONY ILCE-7': 'Sony A7',
  'SONY ILCE-7CR': 'Sony A7CR',
  'SONY ILCE-7CM2': 'Sony A7C II',
  'SONY ILCE-7C': 'Sony A7C',
  'SONY ILCE-6700': 'Sony A6700',
  'SONY ILCE-6600': 'Sony A6600',
  'SONY ILCE-6500': 'Sony A6500',
  'SONY ILCE-6400': 'Sony A6400',
  'SONY ILCE-6300': 'Sony A6300',
  'SONY ILCE-6100': 'Sony A6100',
  'SONY ILCE-6000': 'Sony A6000',
  'SONY ILCE-5100': 'Sony A5100',
  'SONY ILCE-5000': 'Sony A5000',
  'SONY ILCE-3500': 'Sony A3500',
  'SONY ILCE-3000': 'Sony A3000',
  'SONY ILME-FX3': 'Sony FX3',
  'SONY ILME-FX6V': 'Sony FX6',
  'SONY ILME-FX6VK': 'Sony FX6',
  'SONY ILCE-QX1': 'Sony AQX1',
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
  it('formats Sony cameras', () => {
    Object.entries(SONY_CAMERAS).forEach(([model, expected]) => {
      const camera = { make: MAKE_SONY, model };
      expect(formatCameraText(camera, 'medium'))
        .toBe(expected.toLocaleUpperCase());
    });
  });
});
