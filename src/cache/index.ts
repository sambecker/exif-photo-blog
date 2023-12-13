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
  getPhotosCameraCount,
  getPhotosCountIncludingHidden,
  getPhotosTagCount,
  getUniqueCameras,
  getUniqueTags,
  getPhotosTagDateRange,
  getPhotosCameraDateRange,
  getUniqueTagsHidden,
  getUniqueFilmSimulations,
  getPhotosFilmSimulationDateRange,
  getPhotosFilmSimulationCount,
  getPhotosDateRange,
} from '@/services/vercel-postgres';
import { parseCachedPhotoDates, parseCachedPhotosDates } from '@/photo';
import { getBlobPhotoUrls, getBlobUploadUrls } from '@/services/blob';
import type { Session } from 'next-auth';
import { createCameraKey } from '@/camera';
import { PATHS_ADMIN } from '@/site/paths';

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
  // Primitive keys
  case 'sortBy': 
  case 'limit':
  case 'tag':
  case 'simulation':
  case 'includeHidden': {
    const value = options[option];
    return value ? `${option}-${value}` : null;
  }
  // Date keys
  case 'takenBefore':
  case 'takenAfterInclusive': {
    const value = options[option];
    return value ? `${option}-${value.toISOString()}` : null;
  }
  // Complex keys
  case 'camera': {
    const value = options[option];
    return value ? `${option}-${createCameraKey(value)}` : null;
  }
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

export const revalidateAllKeysAndPaths = () => {
  revalidateAllKeys();
  revalidatePath('/', 'layout');
};

export const revalidateAdminPaths = () => {
  PATHS_ADMIN.forEach(path => revalidatePath(path));
};

// Cache

export const getPhotosCached = (
  ...args: Parameters<typeof getPhotos>
) => unstable_cache(
  getPhotos,
  [KEY_PHOTOS, ...getPhotosCacheKeys(...args)],
)(...args).then(parseCachedPhotosDates);

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

export const getPhotosTagCountCached =
  unstable_cache(
    getPhotosTagCount,
    [KEY_PHOTOS, KEY_TAGS],
  );

export const getPhotosCameraCountCached = (
  ...args: Parameters<typeof getPhotosCameraCount>
) =>
  unstable_cache(
    getPhotosCameraCount,
    [KEY_PHOTOS, KEY_COUNT, createCameraKey(...args)],
  )(...args);

export const getPhotosFilmSimulationCountCached =
  unstable_cache(
    getPhotosFilmSimulationCount,
    [KEY_PHOTOS, KEY_FILM_SIMULATIONS, KEY_COUNT],
  );

export const getPhotosTagDateRangeCached =
  unstable_cache(
    getPhotosTagDateRange,
    [KEY_PHOTOS, KEY_TAGS, KEY_DATE_RANGE],
  );

export const getPhotosCameraDateRangeCached =
  unstable_cache(
    getPhotosCameraDateRange,
    [KEY_PHOTOS, KEY_CAMERAS, KEY_DATE_RANGE],
  );

export const getPhotosFilmSimulationDateRangeCached =
  unstable_cache(
    getPhotosFilmSimulationDateRange,
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

// No Store

export const getPhotoNoStore = (...args: Parameters<typeof getPhoto>) => {
  unstable_noStore();
  return getPhoto(...args);
};

export const getBlobUploadUrlsNoStore: typeof getBlobUploadUrls = (...args) => {
  unstable_noStore();
  return getBlobUploadUrls(...args);
};

export const getBlobPhotoUrlsNoStore: typeof getBlobPhotoUrls = (...args) => {
  unstable_noStore();
  return getBlobPhotoUrls(...args);
};

export const getImageCacheHeadersForAuth = (session: Session | null) => {
  return {
    'Cache-Control': !session?.user
      ? 's-maxage=3600, stale-while-revalidate=59'
      : 's-maxage=1, stale-while-revalidate=59',
  };
};
