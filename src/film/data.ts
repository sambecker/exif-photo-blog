import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';

export const getPhotosFilmDataCached = ({
  film,
  limit,
}: {
  film: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ film, limit }),
    getPhotosMetaCached({ film }),
  ]);
