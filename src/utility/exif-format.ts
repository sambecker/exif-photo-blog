import { formatNumberToFraction, roundToString } from './number';

export const formatAperture = (aperture?: number) =>
  aperture
    ? `ƒ/${roundToString(aperture)}`
    : undefined;

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
