import { Photo, descriptionForPhotoSet } from '@/photo';
import { Device, titleForDevice } from '.';
import {
  absolutePathForDevice,
  absolutePathForDeviceImage,
} from '@/site/paths';

// Meta functions moved to separate file to avoid
// dependencies (camelcase-keys) found in photo/index.ts
// that cause Jest to crash

export const descriptionForDevicePhotos = (
  photos: Photo[],
  dateBased?: boolean,
) =>
  descriptionForPhotoSet(photos, 'device', dateBased);

export const generateMetaForDevice = (
  device: Device,
  photos: Photo[]
) => ({
  url: absolutePathForDevice(device),
  title: titleForDevice(device, photos),
  description: descriptionForDevicePhotos(photos, true),
  images: absolutePathForDeviceImage(device),
});
