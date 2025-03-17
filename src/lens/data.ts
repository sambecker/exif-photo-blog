import { getLensFromParams, lensFromPhoto } from '.';
import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';

export const getPhotosLensDataCached = async (
  make: string,
  model: string,
  limit: number,
) => {
  const lens = getLensFromParams({ make, model });
  return Promise.all([
    getPhotosCached({ lens, limit }),
    getPhotosMetaCached({ lens }),
  ])
    .then(([photos, meta]) => [
      photos,
      meta,
      lensFromPhoto(photos[0], lens),
    ] as const);
};
