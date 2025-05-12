import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import { Lens, lensFromPhoto, formatLensText } from '.';
import {
  absolutePathForLens,
  absolutePathForLensImage,
} from '@/app/paths';
import { I18NState } from '@/i18n/state';

// Meta functions moved to separate file to avoid
// dependencies (camelcase-keys) found in photo/index.ts
// which cause Jest to crash

export const titleForLens = (
  lens: Lens,
  photos: Photo[],
  appText: I18NState,
  explicitCount?: number,
) => [
  `${appText.category.lens}:`,
  formatLensText(lensFromPhoto(photos[0], lens)),
  photoQuantityText(explicitCount ?? photos.length, appText),
].join(' ');

export const shareTextForLens = (
  lens: Lens,
  photos: Photo[],
  appText: I18NState,
) =>
  [
    `${appText.category.lens}:`,
    formatLensText(lensFromPhoto(photos[0], lens)),
  ].join(' ');

export const descriptionForLensPhotos = (
  photos: Photo[],
  appText: I18NState,
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

export const generateMetaForLens = (
  lens: Lens,
  photos: Photo[],
  appText: I18NState,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForLens(lens),
  title: titleForLens(lens, photos, appText, explicitCount),
  description:
    descriptionForLensPhotos(
      photos,
      appText,
      true,
      explicitCount,
      explicitDateRange,
    ),
  images: absolutePathForLensImage(lens),
});
