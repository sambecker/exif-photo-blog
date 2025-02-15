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
  getUniqueTagsHidden,
  getUniqueFilmSimulations,
  getPhotosNearId,
  getPhotosMostRecentUpdate,
  getPhotosMeta,
  getUniqueFocalLengths,
  getUniqueLenses,
} from '@/photo/db/query';
import { GetPhotosOptions } from './db';
import { parseCachedPhotoDates, parseCachedPhotosDates } from '@/photo';
import { createCameraKey } from '@/camera';
import {
  PATHS_ADMIN,
  PATHS_TO_CACHE,
  PATH_ADMIN,
  PATH_FEED,
  PATH_GRID,
  PATH_ROOT,
  PREFIX_CAMERA,
  PREFIX_FILM_SIMULATION,
  PREFIX_TAG,
  pathForPhoto,
} from '@/site/paths';
import { createLensKey } from '@/lens';

// Table key
const KEY_PHOTOS            = 'photos';
const KEY_PHOTO             = 'photo';
// Field keys
const KEY_TAGS              = 'tags';
const KEY_CAMERAS           = 'cameras';
const KEY_LENSES            = 'lenses';
const KEY_FILM_SIMULATIONS  = 'film-simulations';
const KEY_FOCAL_LENGTHS     = 'focal-lengths';
// Type keys
const KEY_COUNT             = 'count';
const KEY_HIDDEN            = 'hidden';
const KEY_DATE_RANGE        = 'date-range';

const getPhotosCacheKeyForOption = (
  options: GetPhotosOptions,
  option: keyof GetPhotosOptions,
): string | null => {
  switch (option) {
  // Complex keys
  case 'camera': {
    const value = options[option];
    return value ? `${option}-${createCameraKey(value)}` : null;
  }
  case 'lens': {
    const value = options[option];
    return value ? `${option}-${createLensKey(value)}` : null;
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

const getPhotosCacheKeys = (options: GetPhotosOptions = {}) => {
  const tags: string[] = [];

  Object.keys(options).forEach(key => {
    const tag = getPhotosCacheKeyForOption(
      options,
      key as keyof GetPhotosOptions,
    );
    if (tag) { tags.push(tag); }
  });

  return tags;
};

export const revalidatePhotosKey = () =>
  revalidateTag(KEY_PHOTOS);

export const revalidateTagsKey = () =>
  revalidateTag(KEY_TAGS);

export const revalidateCamerasKey = () =>
  revalidateTag(KEY_CAMERAS);

export const revalidateFilmSimulationsKey = () =>
  revalidateTag(KEY_FILM_SIMULATIONS);

export const revalidateAllKeys = () => {
  revalidatePhotosKey();
  revalidateTagsKey();
  revalidateCamerasKey();
  revalidateFilmSimulationsKey();
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
  revalidateTagsKey();
  revalidateCamerasKey();
  revalidateFilmSimulationsKey();
  // Paths
  revalidatePath(pathForPhoto({ photo: photoId }), 'layout');
  revalidatePath(PATH_ROOT, 'layout');
  revalidatePath(PATH_GRID, 'layout');
  revalidatePath(PATH_FEED, 'layout');
  revalidatePath(PREFIX_TAG, 'layout');
  revalidatePath(PREFIX_CAMERA, 'layout');
  revalidatePath(PREFIX_FILM_SIMULATION, 'layout');
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

export const getPhotosMetaCached = (
  ...args: Parameters<typeof getPhotosMeta>
) => unstable_cache(
  getPhotosMeta,
  [KEY_PHOTOS, KEY_COUNT, KEY_DATE_RANGE, ...getPhotosCacheKeys(...args)],
)(...args);

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

export const getUniqueTagsHiddenCached =
  unstable_cache(
    getUniqueTagsHidden,
    [KEY_PHOTOS, KEY_TAGS, KEY_HIDDEN],
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

export const getUniqueFilmSimulationsCached =
  unstable_cache(
    getUniqueFilmSimulations,
    [KEY_PHOTOS, KEY_FILM_SIMULATIONS],
  );

export const getUniqueFocalLengthsCached =
  unstable_cache(
    getUniqueFocalLengths,
    [KEY_PHOTOS, KEY_FOCAL_LENGTHS],
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
