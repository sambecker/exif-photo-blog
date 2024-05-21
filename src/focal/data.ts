import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';

export const getPhotosFocalDataCached = ({
  focal,
  limit,
}: {
  focal: number,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ focal, limit }),
    getPhotosMetaCached({ focal }),
  ]);

