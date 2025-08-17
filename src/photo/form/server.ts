import {
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
import type { ExifData } from 'ts-exif-parser';

export const convertExifToFormData = (
  data: ExifData,
  dataExifr?: any,
  film?: FujifilmSimulation,
  recipeData?: FujifilmRecipe,
): Partial<Record<keyof PhotoExif, string | undefined>> => {
  let title: string | undefined = dataExifr?.title?.value;
  let caption: string | undefined;
  const description: string | undefined =
    data.tags?.ImageDescription ||
    dataExifr?.ImageDescription ||
    dataExifr?.description?.value;
  const tags: string[] | undefined = dataExifr?.subject;

  if (title && title !== description) {
    caption = description;
  } else {
    title = description;
  }

  return {
    aspectRatio: getAspectRatioFromExif(data).toString(),
    make: data.tags?.Make,
    model: data.tags?.Model,
    focalLength: data.tags?.FocalLength?.toString(),
    focalLengthIn35MmFormat: data.tags?.FocalLengthIn35mmFormat?.toString(),
    lensMake: data.tags?.LensMake,
    lensModel: data.tags?.LensModel,
    fNumber: (
      data.tags?.FNumber?.toString() ||
      convertApertureValueToFNumber(data.tags?.ApertureValue)
    ),
    iso: data.tags?.ISO?.toString() || data.tags?.ISOSpeed?.toString(),
    exposureTime: data.tags?.ExposureTime?.toString(),
    exposureCompensation: data.tags?.ExposureCompensation?.toString(),
    latitude:
      !GEO_PRIVACY_ENABLED ? data.tags?.GPSLatitude?.toString() : undefined,
    longitude:
      !GEO_PRIVACY_ENABLED ? data.tags?.GPSLongitude?.toString() : undefined,
    film,
    recipeData: JSON.stringify(recipeData),
    ...data.tags?.DateTimeOriginal && {
      takenAt: convertTimestampWithOffsetToPostgresString(
        data.tags.DateTimeOriginal,
        getOffsetFromExif(data),
      ),
      takenAtNaive:
        convertTimestampToNaivePostgresString(data.tags.DateTimeOriginal),
    },
    ...title && { title },
    ...caption && { caption },
    ...Array.isArray(tags) && { tags: tags.join(', ') },
  };
};
