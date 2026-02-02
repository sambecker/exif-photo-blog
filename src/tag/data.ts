import { getPhotos, getPhotosMeta } from '@/photo/query';

export const getPhotosTagData = ({
  tag,
  limit,
}: {
  tag: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotos({ tag, limit }),
    getPhotosMeta({ tag }),
  ]);

