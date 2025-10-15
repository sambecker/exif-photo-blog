import { Camera } from '@/camera';
import { Lens } from '../lens';
import { capitalizeWords } from '@/utility/string';

const MAKE_GOOGLE = 'google';

export const isCameraMakeGoogle = (make?: string) =>
  make?.toLocaleLowerCase() === MAKE_GOOGLE;

export const isCameraGoogle = ({ make }: Camera) =>
  isCameraMakeGoogle(make);

export const isLensMakeGoogle = (make?: string) =>
  make?.toLocaleLowerCase() === MAKE_GOOGLE;

export const isLensGoogle = ({ make, model }: Lens) =>
  isLensMakeGoogle(make) ||
  /^Pixel [0-9a-z]+/i.test(model);

export const formatGoogleLensText = (
  model: string,
  includeDeviceName?: boolean,
) => {
  const [
    _match,
    phoneName,
    lensVariant, // Expected: 'Back' or 'Front'
    lensVariantRemainder, // Expected: 'Camera'
    focalLength,
    _aperture,
  // eslint-disable-next-line max-len
  ] = (/^(Pixel (?:[0-9a-z])+(?: Pro)*)(?: (back|front))* (.+) ([0-9\.]+)mm.*?f\/([0-9\.]+)/gi.exec(model) ?? []);

  if (phoneName && lensVariant && focalLength) {
    const lensName = capitalizeWords(lensVariant);
    const focalText = `(${focalLength}mm)`;
    if (includeDeviceName) {
      return `${phoneName} ${lensName} ${focalText}`;
    } else {
      return lensVariantRemainder
        ? `${lensName} ${capitalizeWords(lensVariantRemainder)} ${focalText}`
        : `${lensName} ${focalText}`;
    }
  }

  return model;
};
