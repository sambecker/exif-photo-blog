import { getPhotos, getPhotosMeta } from '@/photo/query';

export const getPhotosRecipeData = ({
  recipe,
  limit,
}: {
  recipe: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotos({ recipe, limit }),
    getPhotosMeta({ recipe }),
  ]);
