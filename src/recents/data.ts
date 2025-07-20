import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';

export const getPhotosRecentsDataCached = ({
  limit,
}: {
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ recent: true, limit }),
    getPhotosMetaCached({ recent: true }),
  ]);
