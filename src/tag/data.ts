import {
  getPhotosCachedCached,
  getPhotosTagMetaCached,
} from '@/photo/cache';

export const getPhotosTagDataCached = ({
  tag,
  limit,
}: {
  tag: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCachedCached({ tag, limit }),
    getPhotosTagMetaCached(tag),
  ]);

