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
  // eslint-disable-next-line max-len
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
    // X + XS
    case 'X':
    case 'XS':
    case 'XS Max':
      switch (aperture) {
      case '1.8': return format('Main');
      case '2.4': return format('Telephoto');
      }
    // XR + SE (single lens)
    case 'XR':
    case 'SE':
      return format('Main');
    // 11
    case '11':
      switch (aperture) {
      case '2.4': return format('Wide');
      case '1.8': return format('Main');
      }
    case '11 Pro':
    case '11 Pro Max':
      switch (aperture) {
      case '2.4': return format('Wide');
      case '1.8': return format('Main');
      case '2.0': return format('Telephoto');
      }
    // 12
    case '12':
      switch (aperture) {
      case '2.4': return format('Wide');
      case '1.6': return format('Main');
      }
    case '12 Pro':
      switch (aperture) {
      case '2.4': return format('Wide');
      case '1.6': return format('Main');
      case '2.0': return format('Telephoto');
      }
    case '12 Pro Max':
      switch (aperture) {
      case '2.4': return format('Wide');
      case '1.6': return format('Main');
      case '2.2': return format('Telephoto');
      }
    // 13
    case '13':
    case '13 Plus':
      switch (aperture) {
      case '2.4': return format('Wide');
      case '1.6': return format('Main');
      }
    case '13 Pro':
    case '13 Pro Max':
      switch (aperture) {
      case '1.8': return format('Wide');
      case '1.5': return format('Main');
      case '2.8': return format('Telephoto');
      }
    // 14
    case '14':
    case '14 Plus':
      switch (aperture) {
      case '2.4': return format('Wide');
      case '1.5': return format('Main');
      }
    case '14 Pro':
    case '14 Pro Max':
      switch (aperture) {
      case '2.2': return format('Wide');
      case '1.78': return format('Main');
      case '2.8': return format('Telephoto');
      }
    // 15
    case '15':
    case '15 Plus':
      switch (aperture) {
      case '2.4': return format('Wide');
      case '1.6': return format('Main');
      }
    case '15 Pro':
    case '15 Pro Max':
      switch (aperture) {
      case '2.2': return format('Wide');
      case '1.78': return format('Main');
      case '2.8': return format('Telephoto');
      }
    // 16 (single lens)
    case '16e':
      return format('Main');
    case '16':
    case '16 Plus':
      switch (aperture) {
      case '2.2': return format('Wide');
      case '1.6': return format('Main');
      }
    case '16 Pro':
    case '16 Pro Max':
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
