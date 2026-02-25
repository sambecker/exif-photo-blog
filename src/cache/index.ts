import { PATHS_ADMIN, PATHS_TO_CACHE } from '@/app/path';
import { revalidatePath, revalidateTag } from 'next/cache';

// Page keys
export const KEY_ABOUT          = 'about';
// Table key
export const KEY_PHOTOS         = 'photos';
export const KEY_PHOTO          = 'photo';
// Field keys
export const KEY_YEARS          = 'years';
export const KEY_CAMERAS        = 'cameras';
export const KEY_LENSES         = 'lenses';
export const KEY_ALBUMS         = 'albums';
export const KEY_TAGS           = 'tags';
export const KEY_RECIPES        = 'recipes';
export const KEY_FILMS          = 'films';
export const KEY_FOCAL_LENGTHS  = 'focal-lengths';
// Type keys
export const KEY_COUNT          = 'count';
export const KEY_DATE_RANGE     = 'date-range';

export const revalidateAboutKey = () =>
  revalidateTag(KEY_ABOUT, 'max');

export const revalidatePhotosKey = () =>
  revalidateTag(KEY_PHOTOS, 'max');

export const revalidateYearsKey = () =>
  revalidateTag(KEY_YEARS, 'max');

export const revalidateCamerasKey = () =>
  revalidateTag(KEY_CAMERAS, 'max');

export const revalidateLensesKey = () =>
  revalidateTag(KEY_LENSES, 'max');

export const revalidateAlbumsKey = () =>
  revalidateTag(KEY_ALBUMS, 'max');

export const revalidateTagsKey = () =>
  revalidateTag(KEY_TAGS, 'max');

export const revalidateRecipesKey = () =>
  revalidateTag(KEY_RECIPES, 'max');

export const revalidateFilmsKey = () =>
  revalidateTag(KEY_FILMS, 'max');

export const revalidateFocalLengthsKey = () =>
  revalidateTag(KEY_FOCAL_LENGTHS, 'max');

export const revalidateAllKeys = () => {
  revalidateAboutKey();
  revalidatePhotosKey();
  revalidateYearsKey();
  revalidateCamerasKey();
  revalidateLensesKey();
  revalidateAlbumsKey();
  revalidateTagsKey();
  revalidateRecipesKey();
  revalidateFilmsKey();
  revalidateFocalLengthsKey();
};

export const revalidateAdminPaths = () => {
  PATHS_ADMIN.forEach(path => revalidatePath(path));
};

export const revalidateAllKeysAndPaths = () => {
  revalidateAllKeys();
  PATHS_TO_CACHE.forEach(path => revalidatePath(path, 'layout'));
};
