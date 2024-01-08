import { OrientationTypes, type ExifData } from 'ts-exif-parser';
import { formatNumberToFraction } from './number';

const OFFSET_REGEX = /[+-]\d\d:\d\d/;

export const getOffsetFromExif = (data: ExifData) =>
  Object.values(data.tags as any)
    .find((value: any) =>
      typeof value === 'string' &&
      OFFSET_REGEX.test(value)
    ) as string | undefined;

export const getAspectRatioFromExif = (data: ExifData): number => {
  // Using '||' operator to handle `Orientation` unexpectedly being '0'
  const orientation = data.tags?.Orientation || OrientationTypes.TOP_LEFT;

  const width = data.imageSize?.width ?? 3.0;
  const height = data.imageSize?.height ?? 2.0;

  switch (orientation) {
  case OrientationTypes.TOP_LEFT:
  case OrientationTypes.TOP_RIGHT:
  case OrientationTypes.BOTTOM_RIGHT:
  case OrientationTypes.BOTTOM_LEFT:
  case OrientationTypes.LEFT_TOP:
  case OrientationTypes.RIGHT_BOTTOM:
    return width / height;
  case OrientationTypes.RIGHT_TOP:
  case OrientationTypes.LEFT_BOTTOM:
    return height / width;
  }
};

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
