import { OrientationTypes, type ExifData, ExifTags } from 'ts-exif-parser';

export const getCompatibleExifValue = (
  key: keyof ExifTags,
  exif: ExifData,
  exifr: any,
  exifrSpecificKey?: string,
) => exif.tags?.[key] || exifr?.[exifrSpecificKey || key];

const isValueOffset = (value: any) =>
  typeof value === 'string' &&
  /^[+-]\d\d:\d\d$/.test(value);

export const getOffsetFromExif = (
  exif: ExifData,
  exifr: any,
) => (
  Object.values(exif.tags as any).find(isValueOffset) ||
  Object.values(exifr).find(isValueOffset)
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

export const convertApertureValueToFNumber = (
  apertureValue?: string,
): string | undefined => {
  if (apertureValue) {
    const aperture = parseInt(apertureValue);
    if (aperture <= 10) {
      switch (aperture) {
        case 0: return '1';
        case 1: return '1.4';
        case 2: return '2';
        case 3: return '2.8';
        case 4: return '4';
        case 5: return '5.6';
        case 6: return '8';
        case 7: return '11';
        case 8: return '16';
        case 9: return '22';
        case 10: return '32';
      }
    } else {
      const value = Math.round(Math.pow(2, aperture / 2.0) * 10) / 10;
      return Number.isInteger(value)
        ? value.toFixed(0)
        : value.toFixed(1);
    }
  } else {
    return undefined;
  }
};
