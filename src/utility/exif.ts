import type { ExifData } from 'ts-exif-parser';

const OFFSET_REGEX = /[+-]\d\d:\d\d/;

export const getOffsetFromExif = (data: ExifData) =>
  Object.values(data.tags as any)
    .find((value: any) =>
      typeof value === 'string' &&
      OFFSET_REGEX.test(value)
    ) as string | undefined;

export const formatFocalLength = (focalLength?: number) =>
  focalLength !== undefined ? `${focalLength}mm` : undefined;

export const formatAperture = (aperture?: number) =>
  aperture !== undefined ? `ƒ/${aperture}` : undefined;

export const formatIso = (iso?: number) =>
  iso !== undefined ? `ISO ${iso}` : undefined;

export const formatExposureTime = (exposureTime?: number) =>
  exposureTime !== undefined
    ? `Shutter 1/${Math.floor(1 / (exposureTime ?? 1))}`
    : undefined;

const fractionForDecimal = (decimal: number, fractionCharacter?: boolean) => {
  switch (Math.abs(Math.floor(decimal * 100))) {
  case 33:
    return fractionCharacter ? '⅓' : '1/3';
  case 50:
    return fractionCharacter ? '½' : '1/2';
  case 66:
  case 67:
    return fractionCharacter ? '⅔' : '2/3';
  }
};

export const formatExposureCompensation = (exposureCompensation?: number) => {
  if (exposureCompensation) {
    const decimal = exposureCompensation % 1;
    const whole = Math.abs(exposureCompensation - decimal);
    const fraction = fractionForDecimal(decimal);
    const sign = exposureCompensation > 0 ? '+' : '-';
    return `${sign}${whole ? `${whole} ` : ''}${fraction ?? ''} EV`;
  } else {
    return undefined;
  }
};

export const formatModelShort = (model?: string) => {
  const textLength = model?.length ?? 0;
  if (textLength > 0 && textLength <= 8) {
    return model;
  } else if (model?.includes('iPhone')) {
    return model.split('iPhone')[1];
  } else {
    return undefined;
  }
};
