import { getPhotos, getPhotosMeta } from '@/photo/query';

export const getPhotosFocalLengthData = ({
  focal,
  limit,
}: {
  focal: number,
  limit?: number,
}) =>
  Promise.all([
    getPhotos({ focal, limit }),
    getPhotosMeta({ focal }),
  ]);
