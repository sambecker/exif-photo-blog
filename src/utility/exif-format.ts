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

export const formatExposureCompensation = (
  exposureCompensation?: number,
  { thirdsRoundedToTenths = false }: { thirdsRoundedToTenths?: boolean } = {},
) => {
  if (
    exposureCompensation &&
    Math.abs(exposureCompensation) > 0.01
  ) {
    const thirds = Math.round(exposureCompensation * 3) / 3;
    // Some cameras encode third-stop settings as tenths, e.g. -0.3 and -0.7.
    // Only recover thirds whose rounded encoding matches the recorded value.
    const value = thirdsRoundedToTenths &&
      Math.round(thirds * 10) / 10 === exposureCompensation
      ? thirds : exposureCompensation;
    return `${formatNumberToFraction(value)}ev`;
  } else {
    return undefined;
  }
};
