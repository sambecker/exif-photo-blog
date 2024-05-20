import {
  getPhotosCached,
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
    getPhotosCached({ tag, limit }),
    getPhotosTagMetaCached(tag),
  ]);

