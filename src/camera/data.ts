import { cameraFromPhoto, getCameraFromParams } from '.';
import {
  getPhotosCached,
  getPhotosCameraMetaCached,
} from '@/photo/cache';

export const getPhotosCameraDataCached = async (
  make: string,
  model: string,
  limit: number,
) => {
  const camera = getCameraFromParams({ make, model });
  return Promise.all([
    getPhotosCached({ camera, limit }),
    getPhotosCameraMetaCached(camera),
  ])
    .then(([photos, meta]) => [
      photos,
      meta,
      cameraFromPhoto(photos[0], camera),
    ] as const);
};
