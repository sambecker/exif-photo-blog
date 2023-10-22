import type { ExifData } from 'ts-exif-parser';
import { formatNumberToFraction } from './number';

const OFFSET_REGEX = /[+-]\d\d:\d\d/;

export const getOffsetFromExif = (data: ExifData) =>
  Object.values(data.tags as any)
    .find((value: any) =>
      typeof value === 'string' &&
      OFFSET_REGEX.test(value)
    ) as string | undefined;

export const formatFocalLength = (focalLength?: number) =>
  focalLength ? `${focalLength}mm` : undefined;

export const formatAperture = (aperture?: number) =>
  aperture ? `ƒ/${aperture}` : undefined;

export const formatIso = (iso?: number) =>
  iso ? `ISO ${iso}` : undefined;

export const formatExposureTime = (exposureTime = 0) =>
  exposureTime > 0
    ? exposureTime < 1
      ? `1/${Math.floor(1 / exposureTime)}s`
      : `${exposureTime}s`
    : undefined;

export const formatExposureCompensation = (exposureCompensation?: number) => {
  if (
    exposureCompensation &&
    Math.abs(exposureCompensation) > 0.01
  ) {
    return `${formatNumberToFraction(exposureCompensation)}ev`;
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
