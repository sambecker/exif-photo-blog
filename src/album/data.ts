import { getPhotosCached, getPhotosMetaCached } from '@/photo/cache';
import { Album } from '.';

export const getPhotosAlbumDataCached = ({
  album,
  limit,
}: {
  album: Album,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ album, limit }),
    getPhotosMetaCached({ album }),
  ]);

