import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import { Camera, cameraFromPhoto, formatCameraText } from '.';
import {
  absolutePathForCamera,
  absolutePathForCameraImage,
} from '@/app/path';
import { AppTextState } from '@/i18n/state';

// Meta functions moved to separate file to avoid
// dependencies (camelcase-keys) found in photo/index.ts
// which cause Jest to crash

export const titleForCamera = (
  camera: Camera,
  photos: Photo[],
  appText: AppTextState,
  explicitCount?: number,
) => [
  appText.category.cameraTitle(
    formatCameraText(cameraFromPhoto(photos[0], camera)),
  ),
  photoQuantityText(explicitCount ?? photos.length, appText),
].join(' ');

export const shareTextForCamera = (
  camera: Camera,
  photos: Photo[],
  appText: AppTextState,
) =>
  appText.category.cameraShare(
    formatCameraText(cameraFromPhoto(photos[0], camera)),
  );

export const descriptionForCameraPhotos = (
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

export const generateMetaForCamera = (
  camera: Camera,
  photos: Photo[],
  appText: AppTextState,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForCamera(camera),
  title: titleForCamera(camera, photos, appText, explicitCount),
  description:
    descriptionForCameraPhotos(
      photos,
      appText,
      true,
      explicitCount,
      explicitDateRange,
    ),
  images: absolutePathForCameraImage(camera),
});
