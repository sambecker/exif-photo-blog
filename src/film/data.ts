import { getPhotos, getPhotosMeta } from '@/photo/query';

export const getPhotosFilmData = ({
  film,
  limit,
}: {
  film: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotos({ film, limit }),
    getPhotosMeta({ film }),
  ]);
