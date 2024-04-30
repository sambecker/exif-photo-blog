import {
  revalidatePath,
  revalidateTag,
  unstable_cache,
  unstable_noStore,
} from 'next/cache';
import {
  GetPhotosOptions,
  getPhoto,
  getPhotos,
  getPhotosCount,
  getPhotosCountIncludingHidden,
  getUniqueCameras,
  getUniqueTags,
  getPhotosTagMeta,
  getPhotosCameraMeta,
  getUniqueTagsHidden,
  getUniqueFilmSimulations,
  getPhotosFilmSimulationMeta,
  getPhotosDateRange,
  getPhotosNearId,
  getPhotosMostRecentUpdate,
} from '@/photo/db';
import { parseCachedPhotoDates, parseCachedPhotosDates } from '@/photo';
import { createCameraKey } from '@/camera';
import {
  PATHS_ADMIN,
  PATHS_TO_CACHE,
  PATH_ADMIN,
  PATH_GRID,
  PATH_ROOT,
  PREFIX_CAMERA,
  PREFIX_FILM_SIMULATION,
  PREFIX_TAG,
  pathForPhoto,
} from '@/site/paths';
import { cache } from 'react';

// Table key
const KEY_PHOTOS            = 'photos';
const KEY_PHOTO             = 'photo';
// Field keys
const KEY_TAGS              = 'tags';
const KEY_CAMERAS           = 'cameras';
const KEY_FILM_SIMULATIONS  = 'film-simulations';
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
  case 'takenBefore':
  case 'takenAfterInclusive': {
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
      key as keyof GetPhotosOptions
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
  revalidatePath(pathForPhoto(photoId), 'layout');
  revalidatePath(PATH_ROOT, 'layout');
  revalidatePath(PATH_GRID, 'layout');
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
export const getPhotosCachedCached = cache(getPhotosCached);

const getPhotosNearIdCached = (
  ...args: Parameters<typeof getPhotosNearId>
) => unstable_cache(
  getPhotosNearId,
  [KEY_PHOTOS],
)(...args).then(({ photos, photo }) => ({
  photos: parseCachedPhotosDates(photos),
  photo: photo ? parseCachedPhotoDates(photo) : undefined,
}));
export const getPhotosNearIdCachedCached = cache(getPhotosNearIdCached);

export const getPhotosDateRangeCached =
  unstable_cache(
    getPhotosDateRange,
    [KEY_PHOTOS, KEY_DATE_RANGE],
  );

export const getPhotosCountCached =
  unstable_cache(
    getPhotosCount,
    [KEY_PHOTOS, KEY_COUNT],
  );

export const getPhotosCountIncludingHiddenCached =
  unstable_cache(
    getPhotosCountIncludingHidden,
    [KEY_PHOTOS, KEY_COUNT, KEY_HIDDEN],
  );

export const getPhotosMostRecentUpdateCached =
  unstable_cache(
    () => getPhotosMostRecentUpdate(),
    [KEY_PHOTOS, KEY_COUNT, KEY_DATE_RANGE],
  );

export const getPhotosTagMetaCached =
  unstable_cache(
    getPhotosTagMeta,
    [KEY_PHOTOS, KEY_TAGS, KEY_DATE_RANGE],
  );

export const getPhotosCameraMetaCached =
  unstable_cache(
    getPhotosCameraMeta,
    [KEY_PHOTOS, KEY_CAMERAS, KEY_DATE_RANGE],
  );

export const getPhotosFilmSimulationMetaCached =
  unstable_cache(
    getPhotosFilmSimulationMeta,
    [KEY_PHOTOS, KEY_FILM_SIMULATIONS, KEY_DATE_RANGE],
  );

export const getPhotoCached = (...args: Parameters<typeof getPhoto>) =>
  unstable_cache(
    getPhoto,
    [KEY_PHOTOS, KEY_PHOTO]
  )(...args).then(photo => photo ? parseCachedPhotoDates(photo) : undefined);

export const getUniqueTagsCached =
  unstable_cache(
    getUniqueTags,
    [KEY_PHOTOS, KEY_TAGS],
  );

export const getUniqueTagsHiddenCached =
  unstable_cache(
    getUniqueTagsHidden,
    [KEY_PHOTOS, KEY_TAGS, KEY_HIDDEN]
  );

export const getUniqueCamerasCached =
  unstable_cache(
    getUniqueCameras,
    [KEY_PHOTOS, KEY_CAMERAS]
  );

export const getUniqueFilmSimulationsCached =
  unstable_cache(
    getUniqueFilmSimulations,
    [KEY_PHOTOS, KEY_FILM_SIMULATIONS],
  );

// No store

export const getPhotoNoStore = (...args: Parameters<typeof getPhoto>) => {
  unstable_noStore();
  return getPhoto(...args);
};
