import { getPhotos, getPhotosMeta } from '@/photo/query';
import { cameraFromPhoto, formatCameraParams } from '.';

export const getPhotosCameraData = async (
  make: string,
  model: string,
  limit: number,
) => {
  const camera = formatCameraParams({ make, model });
  return Promise.all([
    getPhotos ({ camera, limit }),
    getPhotosMeta({ camera }),
  ])
    .then(([photos, meta]) => [
      photos,
      meta,
      cameraFromPhoto(photos[0], camera),
    ] as const);
};
