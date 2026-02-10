import { getPhotos, getPhotosMeta } from '@/photo/query';

export const getPhotosYearData = ({
  year,
  limit,
}: {
  year: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotos({ year, limit }),
    getPhotosMeta({ year }),
  ]);
