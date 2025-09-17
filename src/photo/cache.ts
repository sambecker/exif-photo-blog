import {
  revalidatePath,
  revalidateTag,
  unstable_cache,
  unstable_noStore,
} from 'next/cache';
import {
  getPhoto,
  getPhotos,
  getUniqueCameras,
  getUniqueTags,
  getUniqueFilms,
  getPhotosNearId,
  getPhotosMostRecentUpdate,
  getPhotosMeta,
  getUniqueFocalLengths,
  getUniqueLenses,
  getUniqueRecipes,
  getUniqueYears,
} from '@/photo/query';
import { PhotoQueryOptions } from '@/db';
import { parseCachedPhotoDates, parseCachedPhotosDates } from '@/photo';
import { createCameraKey } from '@/camera';
import {
  PATHS_ADMIN,
  PATHS_TO_CACHE,
  PATH_ADMIN,
  PATH_FULL,
  PATH_GRID,
  PATH_ROOT,
  PREFIX_CAMERA,
  PREFIX_FILM,
  PREFIX_FOCAL_LENGTH,
  PREFIX_LENS,
  PREFIX_RECIPE,
  PREFIX_TAG,
  pathForPhoto,
  PREFIX_YEAR,
  PREFIX_ALBUM,
} from '@/app/path';
import { createLensKey } from '@/lens';

// Table key
export const KEY_PHOTOS     = 'photos';
const KEY_PHOTO             = 'photo';
// Field keys
const KEY_CAMERAS           = 'cameras';
const KEY_LENSES            = 'lenses';
const KEY_ALBUMS            = 'albums';
const KEY_TAGS              = 'tags';
const KEY_FILMS             = 'films';
const KEY_RECIPES           = 'recipes';
const KEY_FOCAL_LENGTHS     = 'focal-lengths';
const KEY_YEARS             = 'years';
// Type keys
const KEY_COUNT             = 'count';
const KEY_DATE_RANGE        = 'date-range';

const getCacheKeyForPhotoQueryOptions = (
  options: PhotoQueryOptions,
  option: keyof PhotoQueryOptions,
): string | null => {
  switch (option) {
  // Complex keys
    case 'camera': {
      const camera = options[option];
      return camera ? `${option}-${createCameraKey(camera)}` : null;
    }
    case 'lens': {
      const lens = options[option];
      return lens ? `${option}-${createLensKey(lens)}` : null;
    }
    case 'album': {
      const album = options[option];
      return album ? album.slug : null;
    }
    case 'takenBefore':
    case 'takenAfterInclusive': 
    case 'updatedBefore': {
      const value = options[option];
      return value ? `${option}-${value.toISOString()}` : null;
    }
    // Primitive keys
    default:
      const value = options[option];
      return value !== undefined ? `${option}-${value}` : null;
  }
};

const getPhotosCacheKeys = (options: PhotoQueryOptions = {}) => {
  const tags: string[] = [];

  Object.keys(options).forEach(key => {
    const tag = getCacheKeyForPhotoQueryOptions(
      options,
      key as keyof PhotoQueryOptions,
    );
    if (tag) { tags.push(tag); }
  });

  return tags;
};

export const revalidatePhotosKey = () =>
  revalidateTag(KEY_PHOTOS);

export const revalidateAlbumsKey = () =>
  revalidateTag(KEY_ALBUMS);

export const revalidateTagsKey = () =>
  revalidateTag(KEY_TAGS);

export const revalidateRecipesKey = () =>
  revalidateTag(KEY_RECIPES);

export const revalidateCamerasKey = () =>
  revalidateTag(KEY_CAMERAS);

export const revalidateLensesKey = () =>
  revalidateTag(KEY_LENSES);

export const revalidateFilmsKey = () =>
  revalidateTag(KEY_FILMS);

export const revalidateFocalLengthsKey = () =>
  revalidateTag(KEY_FOCAL_LENGTHS);

export const revalidateYearsKey = () =>
  revalidateTag(KEY_YEARS);

export const revalidateAllKeys = () => {
  revalidatePhotosKey();
  revalidateAlbumsKey();
  revalidateTagsKey();
  revalidateCamerasKey();
  revalidateLensesKey();
  revalidateFilmsKey();
  revalidateRecipesKey();
  revalidateFocalLengthsKey();
  revalidateYearsKey();
};

export const revalidateAdminPaths = () => {
  PATHS_ADMIN.forEach(path => revalidatePath(path));
};

export const revalidateAllKeysAndPaths = () => {
  revalidateAllKeys();
  PATHS_TO_CACHE.forEach(path => revalidatePath(path, 'layout'));
};

export const revalidatePhoto = (photoId: string) => {
  // Tags
  revalidateTag(photoId);
  revalidateYearsKey();
  revalidateCamerasKey();
  revalidateLensesKey();
  revalidateAlbumsKey();
  revalidateTagsKey();
  revalidateFilmsKey();
  revalidateRecipesKey();
  revalidateFocalLengthsKey();
  // Paths
  revalidatePath(pathForPhoto({ photo: photoId }), 'layout');
  revalidatePath(PATH_ROOT, 'layout');
  revalidatePath(PATH_GRID, 'layout');
  revalidatePath(PATH_FULL, 'layout');
  revalidatePath(PREFIX_CAMERA, 'layout');
  revalidatePath(PREFIX_LENS, 'layout');
  revalidatePath(PREFIX_ALBUM, 'layout');
  revalidatePath(PREFIX_TAG, 'layout');
  revalidatePath(PREFIX_FILM, 'layout');
  revalidatePath(PREFIX_RECIPE, 'layout');
  revalidatePath(PREFIX_FOCAL_LENGTH, 'layout');
  revalidatePath(PREFIX_YEAR, 'layout');
  revalidatePath(PATH_ADMIN, 'layout');
};

// Cache

export const getPhotosCached = (
  ...args: Parameters<typeof getPhotos>
) => unstable_cache(
  getPhotos,
  [KEY_PHOTOS, ...getPhotosCacheKeys(...args)],
)(...args).then(parseCachedPhotosDates);

export const getPhotosNearIdCached = (
  ...args: Parameters<typeof getPhotosNearId>
) => unstable_cache(
  getPhotosNearId,
  [KEY_PHOTOS, ...getPhotosCacheKeys(args[1])],
)(...args).then(({ photos, indexNumber }) => {
  const [photoId, { limit }] = args;
  const photo = photos.find(({ id }) => id === photoId);
  const isPhotoFirst = photos.findIndex(p => p.id === photoId) === 0;
  return {
    photo: photo ? parseCachedPhotoDates(photo) : undefined,
    photos: parseCachedPhotosDates(photos),
    ...limit && {
      photosGrid: photos.slice(
        isPhotoFirst ? 1 : 2,
        isPhotoFirst ? limit - 1 : limit,
      ),
    },
    indexNumber,
  };
});

export const getPhotosMetaCached = unstable_cache(
  getPhotosMeta,
  [KEY_PHOTOS, KEY_COUNT, KEY_DATE_RANGE],
);

export const getPhotosMostRecentUpdateCached =
  unstable_cache(
    () => getPhotosMostRecentUpdate(),
    [KEY_PHOTOS, KEY_COUNT, KEY_DATE_RANGE],
  );

export const getPhotoCached = (...args: Parameters<typeof getPhoto>) =>
  unstable_cache(
    getPhoto,
    [KEY_PHOTOS, KEY_PHOTO],
  )(...args).then(photo => photo ? parseCachedPhotoDates(photo) : undefined);
  
export const getUniqueTagsCached =
  unstable_cache(
    getUniqueTags,
    [KEY_PHOTOS, KEY_TAGS],
  );

export const getUniqueCamerasCached =
  unstable_cache(
    getUniqueCameras,
    [KEY_PHOTOS, KEY_CAMERAS],
  );

export const getUniqueLensesCached =
  unstable_cache(
    getUniqueLenses,
    [KEY_PHOTOS, KEY_LENSES],
  );

export const getUniqueFilmsCached =
  unstable_cache(
    getUniqueFilms,
    [KEY_PHOTOS, KEY_FILMS],
  );

export const getUniqueRecipesCached =
  unstable_cache(
    getUniqueRecipes,
    [KEY_PHOTOS, KEY_RECIPES],
  );

export const getUniqueFocalLengthsCached =
  unstable_cache(
    getUniqueFocalLengths,
    [KEY_PHOTOS, KEY_FOCAL_LENGTHS],
  );

export const getUniqueYearsCached =
  unstable_cache(
    getUniqueYears,
    [KEY_PHOTOS, KEY_YEARS],
  );

// No store

export const getPhotosNoStore = (...args: Parameters<typeof getPhotos>) => {
  unstable_noStore();
  return getPhotos(...args);
};

export const getPhotoNoStore = (...args: Parameters<typeof getPhoto>) => {
  unstable_noStore();
  return getPhoto(...args);
};
