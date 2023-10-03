import { Photo, descriptionForPhotoSet, photoQuantityText } from '@/photo';
import { Camera, cameraFromPhoto, formatCameraText } from '.';
import {
  absolutePathForCamera,
  absolutePathForCameraImage,
} from '@/site/paths';

// Meta functions moved to separate file to avoid
// dependencies (camelcase-keys) found in photo/index.ts
// which cause Jest to crash

export const titleForCamera = (
  camera: Camera,
  photos: Photo[],
) => [
  'Shot on',
  formatCameraText(cameraFromPhoto(photos[0], camera)),
  photoQuantityText(photos),
].join(' ');

export const descriptionForCameraPhotos = (
  photos: Photo[],
  dateBased?: boolean,
) =>
  descriptionForPhotoSet(photos, undefined, dateBased);

export const generateMetaForCamera = (
  camera: Camera,
  photos: Photo[]
) => ({
  url: absolutePathForCamera(camera),
  title: titleForCamera(camera, photos),
  description: descriptionForCameraPhotos(photos, true),
  images: absolutePathForCameraImage(camera),
});
