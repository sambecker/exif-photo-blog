import { getPhotos, getPhotosMeta } from '@/photo/query';
import { formatLensParams, lensFromPhoto } from '.';

export const getPhotosLensData = async (
  make: string | undefined,
  model: string,
  limit: number,
) => {
  const lens = formatLensParams({ make, model });
  return Promise.all([
    getPhotos({ lens, limit }),
    getPhotosMeta({ lens }),
  ])
    .then(([photos, meta]) => [
      photos,
      meta,
      lensFromPhoto(photos[0], lens),
    ] as const);
};
