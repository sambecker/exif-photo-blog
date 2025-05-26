import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import {
  absolutePathForFocalLength,
  absolutePathForFocalLengthImage,
} from '@/app/paths';
import { AppTextState } from '@/i18n/state';
import { CategoryQueryMeta } from '@/category';

type FocalLengthWithMeta = { focal: number } & CategoryQueryMeta;

export type FocalLengths = FocalLengthWithMeta[];

export const getFocalLengthFromString = (focalString?: string) => {
  const focal = focalString?.match(/^([0-9]+)mm/)?.[1];
  return focal ? parseInt(focal, 10) : 0;
};

export const formatFocalLength = (focal?: number) => focal
  ? formatFocalLengthSafe(focal)
  : undefined;

export const formatFocalLengthSafe = (focal = 0) =>
  `${focal}mm`;

export const titleForFocalLength = (
  focal: number,
  photos: Photo[],
  appText: AppTextState,
  explicitCount?: number,
) => [
  appText.category.focalLengthTitle(formatFocalLengthSafe(focal)),
  photoQuantityText(explicitCount ?? photos.length, appText),
].join(' ');

export const shareTextFocalLength = (
  focal: number,
  appText: AppTextState,
) =>
  appText.category.focalLengthShare(formatFocalLengthSafe(focal));

export const descriptionForFocalLengthPhotos = (
  photos: Photo[],
  appText: AppTextState,
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) =>
  descriptionForPhotoSet(
    photos,
    appText,
    undefined,
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForFocalLength = (
  focal: number,
  photos: Photo[],
  appText: AppTextState,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForFocalLength(focal),
  title: titleForFocalLength(focal, photos, appText, explicitCount),
  description: descriptionForFocalLengthPhotos(
    photos,
    appText,
    true,
    explicitCount,
    explicitDateRange,
  ),
  images: absolutePathForFocalLengthImage(focal),
});

export const sortFocalLengths = (focalLengths: FocalLengths) =>
  focalLengths.sort((a, b) => a.focal - b.focal);
