import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';

export const getPhotosYearDataCached = ({
  year,
  limit,
}: {
  year: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ year, limit }),
    getPhotosMetaCached({ year }),
  ]);
