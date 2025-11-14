import { Camera } from '@/camera';
import { Lens } from '../lens';

const MAKE_APPLE = 'apple';

export const isCameraMakeApple = (make?: string) =>
  make?.toLocaleLowerCase() === MAKE_APPLE;

export const isCameraApple = ({ make }: Camera) =>
  isCameraMakeApple(make);

export const isLensMakeApple = (make?: string) =>
  make?.toLocaleLowerCase() === MAKE_APPLE;

export const isLensApple = ({ make, model }: Lens) =>
  isLensMakeApple(make) ||
  /^iPhone [0-9a-z]{1,3}/i.test(model);

export const formatAppleLensText = (
  model: string,
  includeDeviceName?: boolean,
) => {
  const [
    _,
    phoneName,
    side,
    focalLength,
    aperture,
  // eslint-disable-next-line max-len
  ] = (/iPhone ([0-9a-z]{1,3}(?: (?:Pro|Max|Plus|Mini))*).*?(back|front).*?([0-9\.]+)mm.*?f\/([0-9\.]+)/gi.exec(model) ?? []);

  const format = (lensName: string, includeFocalLength = true) => {
    let result = '';
    if (includeDeviceName) {
      result += `${phoneName} `;
    }
    result += lensName;
    if (!includeDeviceName) {
      result += ' Camera';
    }
    if (includeFocalLength && focalLength) {
      result += ` (${focalLength}mm)`;
    }
    return result;
  };

  if (side?.toLocaleUpperCase() === 'FRONT') {
    return format('front', false);
  } else if (side?.toLocaleUpperCase() === 'BACK') {
    switch (phoneName?.toLocaleUpperCase()) {
    // X + XS
      case 'X':
      case 'XS':
      case 'XS MAX':
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
      case '11 PRO':
      case '11 PRO MAX':
        switch (aperture) {
          case '2.4': return format('Wide');
          case '1.8': return format('Main');
          case '2.0': return format('Telephoto');
        }
        // 12
      case '12':
      case '12 MINI':
        switch (aperture) {
          case '2.4': return format('Wide');
          case '1.6': return format('Main');
        }
      case '12 PRO':
        switch (aperture) {
          case '2.4': return format('Wide');
          case '1.6': return format('Main');
          case '2.0': return format('Telephoto');
        }
      case '12 PRO MAX':
        switch (aperture) {
          case '2.4': return format('Wide');
          case '1.6': return format('Main');
          case '2.2': return format('Telephoto');
        }
        // 13
      case '13':
      case '13 MINI':
      case '13 PLUS':
        switch (aperture) {
          case '2.4': return format('Wide');
          case '1.6': return format('Main');
        }
      case '13 PRO':
      case '13 PRO MAX':
        switch (aperture) {
          case '1.8': return format('Wide');
          case '1.5': return format('Main');
          case '2.8': return format('Telephoto');
        }
        // 14
      case '14':
      case '14 PLUS':
        switch (aperture) {
          case '2.4': return format('Wide');
          case '1.5': return format('Main');
        }
      case '14 PRO':
      case '14 PRO MAX':
        switch (aperture) {
          case '2.2': return format('Wide');
          case '1.78': return format('Main');
          case '2.8': return format('Telephoto');
        }
        // 15
      case '15':
      case '15 PLUS':
        switch (aperture) {
          case '2.4': return format('Wide');
          case '1.6': return format('Main');
        }
      case '15 PRO':
      case '15 PRO MAX':
        switch (aperture) {
          case '2.2': return format('Wide');
          case '1.78': return format('Main');
          case '2.8': return format('Telephoto');
        }
      case '16E':
        // Single lens
        return format('Main');
      case '16':
      case '16 PLUS':
        switch (aperture) {
          case '2.2': return format('Wide');
          case '1.6': return format('Main');
        }
      case '16 PRO':
      case '16 PRO MAX':
        switch (aperture) {
          case '2.2': return format('Wide');
          case '1.78': return format('Main');
          case '2.8': return format('Telephoto');
        }
      case 'AIR':
        // Single lens
        return format('Main');
      case '17':
        switch (aperture) {
          case '2.2': return format('Wide');
          case '1.6': return format('Main');
        }
      case '17 PRO':
      case '17 PRO MAX':
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
