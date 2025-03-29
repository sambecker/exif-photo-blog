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

export const isLensGoogle = ({ make }: Lens) =>
  isLensMakeGoogle(make);

export const formatGoogleLensText = (
  model: string,
  includePhoneName?: boolean,
) => {
  const [
    _,
    phoneName,
    lensVariant,
    focalLength,
    _aperture,
  // eslint-disable-next-line max-len
  ] = (/^(Pixel (?:[0-9a-z])+(?: Pro)*) (.+) ([0-9\.]+)mm.*?f\/([0-9\.]+)/gi.exec(model) ?? []);

  if (phoneName && lensVariant && focalLength) {
    const lensName = `${capitalizeWords(lensVariant)} (${focalLength}mm)`;
    return includePhoneName
      ? `${phoneName} ${lensName}`
      : lensName;
  }

  return model;
};
