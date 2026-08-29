import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';

export const getPhotosQueryDataCached = ({
  query,
  limit,
}: {
  query: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ query, limit }),
    getPhotosMetaCached({ query }),
  ]);
