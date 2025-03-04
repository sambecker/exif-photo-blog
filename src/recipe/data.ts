import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';

export const getPhotosRecipeDataCached = ({
  recipe,
  limit,
}: {
  recipe: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ recipe, limit }),
    getPhotosMetaCached({ recipe }),
  ]);
