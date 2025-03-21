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

export const SONY_MODELS = {
  'ILCE-1M2': 'A1 II',
  'ILCE-1': 'A1',
  'ILCE-9M3': 'A9 III',
  'ILCE-9M2': 'A9 II',
  'ILCE-9': 'A9',
  'ILCE-7RM5': 'A7R V',
  'ILCE-7RM4': 'A7R IV',
  'ILCE-7RM4A': 'A7R IVA',
  'ILCE-7RM3': 'A7R III',
  'ILCE-7RM3A': 'A7R IIIA',
  'ILCE-7RM2': 'A7R II',
  'ILCE-7R': 'A7R',
  'ILCE-7SM3': 'A7S III',
  'ILCE-7SM2': 'A7S II',
  'ILCE-7S': 'A7S',
  'ILCE-7M4': 'A7 IV',
  'ILCE-7M3': 'A7 III',
  'ILCE-7M2': 'A7 II',
  'ILCE-7': 'A7',
  'ILCE-7CR': 'A7CR',
  'ILCE-7CM2': 'A7C II',
  'ILCE-7C': 'A7C',
  'ILCE-6700': 'A6700',
  'ILCE-6600': 'A6600',
  'ILCE-6500': 'A6500',
  'ILCE-6400': 'A6400',
  'ILCE-6300': 'A6300',
  'ILCE-6100': 'A6100',
  'ILCE-6000': 'A6000',
  'ILCE-5100': 'A5100',
  'ILCE-5000': 'A5000',
  'ILCE-3500': 'A3500',
  'ILCE-3000': 'A3000',
  'ILME-FX3': 'FX3',
  'ILME-FX6V': 'FX6',
  'ILME-FX6VK': 'FX6',
  'ILCE-QX1': 'AQX1',
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
    Object.entries(SONY_MODELS).forEach(([model, expected]) => {
      const camera = { make: MAKE_SONY, model };
      expect(formatCameraText(camera, 'medium'))
        .toBe(`${MAKE_SONY} ${expected}`.toLocaleUpperCase());
    });
  });
});
