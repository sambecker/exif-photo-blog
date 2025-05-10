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
} from '@/app/paths';
import { APP_TEXT } from '@/app/config';

// Meta functions moved to separate file to avoid
// dependencies (camelcase-keys) found in photo/index.ts
// which cause Jest to crash

export const titleForCamera = (
  camera: Camera,
  photos: Photo[],
  explicitCount?: number,
) => [
  APP_TEXT.category.cameraShare(
    formatCameraText(cameraFromPhoto(photos[0], camera)),
  ),
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const shareTextForCamera = (
  camera: Camera,
  photos: Photo[],
) =>
  APP_TEXT.category.cameraShare(
    formatCameraText(cameraFromPhoto(photos[0], camera)),
  );

export const descriptionForCameraPhotos = (
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

export const generateMetaForCamera = (
  camera: Camera,
  photos: Photo[],
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForCamera(camera),
  title: titleForCamera(camera, photos, explicitCount),
  description:
    descriptionForCameraPhotos(photos, true, explicitCount, explicitDateRange),
  images: absolutePathForCameraImage(camera),
});
