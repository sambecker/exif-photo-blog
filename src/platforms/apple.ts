/* eslint-disable max-len */
import { Camera } from '@/camera';
import { Lens } from '../lens';

const MAKE_APPLE = 'apple';

export const isCameraMakeApple = (make?: string) =>
  make?.toLocaleLowerCase() === MAKE_APPLE;

export const isCameraApple = ({ make }: Camera) =>
  isCameraMakeApple(make);

export const isLensMakeApple = (make?: string) =>
  make?.toLocaleLowerCase() === MAKE_APPLE;

export const isLensApple = ({ make }: Lens) =>
  isLensMakeApple(make);

export const formatAppleLensText = (
  model: string,
  includePhoneName?: boolean,
) => {
  const [
    _,
    phoneName,
    side,
    focalLength,
    aperture,
  ] = (/iPhone ([0-9a-z]{1,3}(?: (?:Pro|Max|Plus))*).*?(back|front).*?([0-9\.]+)mm.*?f\/([0-9\.]+)/gi.exec(model) ?? []);

  const format = (lensName: string, includeFocalLength = true) => {
    let result = '';
    if (includePhoneName) {
      result += `${phoneName} `;
    }
    result += lensName;
    if (!includePhoneName) {
      result += ' Camera';
    }
    if (includeFocalLength && focalLength) {
      result += ` (${focalLength}mm)`;
    }
    return result;
  };

  if (side === 'front') {
    return format('front', false);
  } else if (side === 'back') {
    switch (phoneName) {
    case '13 Pro':
      switch (aperture) {
      case '1.8': return format('Wide');
      case '1.5': return format('Main');
      case '2.8': return format('Telephoto');
      }
    case '14 Pro':
      switch (aperture) {
      case '2.2': return format('Wide');
      case '1.78': return format('Main');
      case '2.8': return format('Telephoto');
      }
    case '15 Pro':
      switch (aperture) {
      case '2.2': return format('Wide');
      case '1.78': return format('Main');
      case '2.8': return format('Telephoto');
      }
    case '16 Pro':
      switch (aperture) {
      case '2.2': return format('Wide');
      case '1.78': return format('Main');
      case '2.8': return format('Telephoto');
      }
    default:
      return format('Back', true);
    }
  }

  return model;
};