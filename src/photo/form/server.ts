import {
  getCompatibleExifValue,
  convertApertureValueToFNumber,
  getAspectRatioFromExif,
  getOffsetFromExif,
} from '@/utility/exif';
import {
  convertTimestampWithOffsetToPostgresString,
  convertTimestampToNaivePostgresString,
} from '@/utility/date';
import { GEO_PRIVACY_ENABLED } from '@/app/config';
import { PhotoExif } from '..';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FujifilmSimulation } from '@/platforms/fujifilm/simulation';
import type { ExifData, ExifTags } from 'ts-exif-parser';

export const convertExifToFormData = (
  exif: ExifData,
  exifr?: any,
  film?: FujifilmSimulation,
  recipeData?: FujifilmRecipe,
): Partial<Record<keyof PhotoExif, string | undefined>> => {
  let title: string | undefined = exifr?.title?.value;
  let caption: string | undefined;
  const description: string | undefined =
    exif.tags?.ImageDescription ||
    exifr?.ImageDescription ||
    exifr?.description?.value;
  const tags: string[] | undefined = exifr?.subject;

  if (title && title !== description) {
    caption = description;
  } else {
    title = description;
  }

  // Convenience function with exif + exifr in scope
  const getExifValue = (
    key: keyof ExifTags,
    exifrSpecificKey?: string,
  ) => getCompatibleExifValue(key, exif, exifr, exifrSpecificKey);

  const dateTimeOriginal = getExifValue('DateTimeOriginal');

  return {
    aspectRatio: getAspectRatioFromExif(exif).toString(),
    make: getExifValue('Make'),
    model: getExifValue('Model'),
    focalLength: getExifValue('FocalLength')?.toString(),
    focalLengthIn35MmFormat:getExifValue('FocalLengthIn35mmFormat')?.toString(),
    lensMake: getExifValue('LensMake'),
    lensModel: getExifValue('LensModel'),
    fNumber: (
      getExifValue('FNumber')?.toString() ||
      convertApertureValueToFNumber(getExifValue('ApertureValue'))
    ),
    iso:
      getExifValue('ISO')?.toString() ||
      getExifValue('ISOSpeed')?.toString(),
    exposureTime: getExifValue('ExposureTime')?.toString(),
    exposureCompensation: getExifValue('ExposureCompensation')?.toString(),
    latitude: !GEO_PRIVACY_ENABLED
      ? getExifValue('GPSLatitude', 'latitude')?.toString()
      : undefined,
    longitude: !GEO_PRIVACY_ENABLED
      ? getExifValue('GPSLongitude', 'longitude')?.toString()
      : undefined,
    film,
    recipeData: JSON.stringify(recipeData),
    ...dateTimeOriginal && {
      takenAt: convertTimestampWithOffsetToPostgresString(
        dateTimeOriginal,
        getOffsetFromExif(exif, exifr),
      ),
      takenAtNaive:
        convertTimestampToNaivePostgresString(dateTimeOriginal),
    },
    ...title && { title },
    ...caption && { caption },
    ...Array.isArray(tags) && { tags: tags.join(', ') },
  };
};
