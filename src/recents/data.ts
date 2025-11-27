import { getPhotos, getPhotosMeta } from '@/photo/query';

export const getPhotosRecentsData = ({
  limit,
}: {
  limit?: number,
}) =>
  Promise.all([
    getPhotos({ recent: true, limit }),
    getPhotosMeta({ recent: true }),
  ]);
