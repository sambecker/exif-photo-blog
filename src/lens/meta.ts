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

// Meta functions moved to separate file to avoid
// dependencies (camelcase-keys) found in photo/index.ts
// which cause Jest to crash

export const titleForLens = (
  lens: Lens,
  photos: Photo[],
  explicitCount?: number,
) => [
  'Lens:',
  formatLensText(lensFromPhoto(photos[0], lens)),
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const shareTextForLens = (
  lens: Lens,
  photos: Photo[],
) =>
  [
    'Lens:',
    formatLensText(lensFromPhoto(photos[0], lens)),
  ].join(' ');

export const descriptionForLensPhotos = (
  photos: Photo[],
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) =>
  descriptionForPhotoSet(
    photos,
    undefined,
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForLens = (
  lens: Lens,
  photos: Photo[],
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForLens(lens),
  title: titleForLens(lens, photos, explicitCount),
  description:
    descriptionForLensPhotos(photos, true, explicitCount, explicitDateRange),
  images: absolutePathForLensImage(lens),
});
