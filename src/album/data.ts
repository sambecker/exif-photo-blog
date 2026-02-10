import { Album } from '.';
import { getPhotos, getPhotosMeta } from '@/photo/query';

export const getPhotosAlbumData = ({
  album,
  limit,
}: {
  album: Album,
  limit?: number,
}) =>
  Promise.all([
    getPhotos({ album, limit }),
    getPhotosMeta({ album }),
  ]);

