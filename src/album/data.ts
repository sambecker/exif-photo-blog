import { getPhotosMetaCached } from '@/photo/cache';
import { Album } from '.';
import { getPhotos } from '@/photo/query';

export const getPhotosAlbumDataCached = ({
  album,
  limit,
}: {
  album: Album,
  limit?: number,
}) =>
  Promise.all([
    getPhotos({ album, limit }),
    getPhotosMetaCached({ album }),
  ]);

