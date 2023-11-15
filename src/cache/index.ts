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
} from '@/services/postgres';
import { parseCachedPhotosDates, parseCachedPhotoDates } from '@/photo';
import { getBlobPhotoUrls, getBlobUploadUrls } from '@/services/blob';
import type { Session } from 'next-auth';
import { Camera, createCameraKey } from '@/camera';
import { PATHS_ADMIN, PATHS_TO_CACHE } from '@/site/paths';
import { FilmSimulation } from '@/simulation';

// Table key
const KEY_PHOTOS            = 'photos';
// Field keys
const KEY_TAGS              = 'tags';
const KEY_CAMERAS           = 'cameras';
const KEY_FILM_SIMULATIONS  = 'film-simulations';
// Type keys
const KEY_COUNT             = 'count';
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
    return value ? `${option}-${value.make}-${value.model}` : null;
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

const getPhotoCacheKey = (photoId: string) => `photo-${photoId}`;

const getPhotoCameraCountKey = (camera: Camera) =>
  `${KEY_COUNT}-${KEY_CAMERAS}-${createCameraKey(camera)}`;

const getPhotoFilmSimulationCountKey = (simulation: FilmSimulation) =>
  `${KEY_COUNT}-${KEY_FILM_SIMULATIONS}-${simulation}`;

const getPhotoTagDateRangeKey = (tag: string) =>
  `${KEY_DATE_RANGE}-${KEY_TAGS}-${tag}`;

const getPhotoCameraDateRangeKey = (camera: Camera) =>
  `${KEY_DATE_RANGE}-${KEY_CAMERAS}-${createCameraKey(camera)}`;

const getPhotoFilmSimulationDateRangeKey = (simulation: FilmSimulation) =>
  `${KEY_DATE_RANGE}-${KEY_FILM_SIMULATIONS}-${simulation}`;

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
  PATHS_TO_CACHE.forEach(path => revalidatePath(path));
};

export const revalidateAdminPaths = () => {
  PATHS_ADMIN.forEach(path => revalidatePath(path));
};

// TODO: Test behavior
// Consider a wrapper function where this is executed at runtime
// and then parsed for dates
export const getPhotosCached: typeof getPhotos = (...args) =>
  unstable_cache(
    getPhotos,
    [KEY_PHOTOS, ...getPhotosCacheKeys(...args)], {
      tags: [KEY_PHOTOS, ...getPhotosCacheKeys(...args)],
    }
  )(...args).then(parseCachedPhotosDates);

export const getPhotosCountCached =
  unstable_cache(
    getPhotosCount,
    [KEY_PHOTOS, KEY_COUNT],
  );

export const getPhotosCountIncludingHiddenCached: typeof getPhotosCount =
  (...args) =>
    unstable_cache(
      () => getPhotosCountIncludingHidden(...args),
      [KEY_PHOTOS, KEY_COUNT], {
        tags: [KEY_PHOTOS, KEY_COUNT],
      }
    )();

export const getPhotosTagCountCached =
  unstable_cache(
    getPhotosTagCount,
    [KEY_PHOTOS, KEY_TAGS],
  );

// eslint-disable-next-line max-len
export const getPhotosCameraCountCached: typeof getPhotosCameraCount = (...args) =>
  unstable_cache(
    () => getPhotosCameraCount(...args),
    [KEY_PHOTOS, getPhotoCameraCountKey(...args)], {
      tags: [KEY_PHOTOS, getPhotoCameraCountKey(...args)],
    }
  )();

// eslint-disable-next-line max-len
export const getPhotosFilmSimulationCountCached: typeof getPhotosFilmSimulationCount = (...args) =>
  unstable_cache(
    () => getPhotosFilmSimulationCount(...args),
    [KEY_PHOTOS, getPhotoFilmSimulationCountKey(...args)], {
      tags: [KEY_PHOTOS, getPhotoFilmSimulationCountKey(...args)],
    }
  )();

// eslint-disable-next-line max-len
export const getPhotosTagDateRangeCached: typeof getPhotosTagDateRange = (...args) =>
  unstable_cache(
    () => getPhotosTagDateRange(...args),
    [KEY_PHOTOS, getPhotoTagDateRangeKey(...args)], {
      tags: [KEY_PHOTOS, getPhotoTagDateRangeKey(...args)],
    }
  )();

// eslint-disable-next-line max-len
export const getPhotosCameraDateRangeCached: typeof getPhotosCameraDateRange = (...args) =>
  unstable_cache(
    () => getPhotosCameraDateRange(...args),
    [KEY_PHOTOS, getPhotoCameraDateRangeKey(...args)], {
      tags: [KEY_PHOTOS, getPhotoCameraDateRangeKey(...args)],
    }
  )();

// eslint-disable-next-line max-len
export const getPhotosFilmSimulationDateRangeCached: typeof getPhotosFilmSimulationDateRange = (...args) =>
  unstable_cache(
    () => getPhotosFilmSimulationDateRange(...args),
    [KEY_PHOTOS, getPhotoFilmSimulationDateRangeKey(...args)], {
      tags: [KEY_PHOTOS, getPhotoFilmSimulationDateRangeKey(...args)],
    }
  )();

export const getPhotoCached: typeof getPhoto = (...args) =>
  unstable_cache(
    () => getPhoto(...args),
    [KEY_PHOTOS, getPhotoCacheKey(...args)], {
      tags: [KEY_PHOTOS, getPhotoCacheKey(...args)],
    }
  )().then(photo => photo ? parseCachedPhotoDates(photo) : undefined);

export const getUniqueTagsCached: typeof getUniqueTags = (...args) =>
  unstable_cache(
    () => getUniqueTags(...args),
    [KEY_PHOTOS, KEY_TAGS], {
      tags: [KEY_PHOTOS, KEY_TAGS],
    }
  )();

// eslint-disable-next-line max-len
export const getUniqueTagsHiddenCached: typeof getUniqueTagsHidden = (...args) =>
  unstable_cache(
    () => getUniqueTagsHidden(...args),
    [KEY_PHOTOS, KEY_TAGS], {
      tags: [KEY_PHOTOS, KEY_TAGS],
    }
  )();

export const getUniqueCamerasCached: typeof getUniqueCameras = (...args) =>
  unstable_cache(
    () => getUniqueCameras(...args),
    [KEY_PHOTOS, KEY_CAMERAS], {
      tags: [KEY_PHOTOS, KEY_CAMERAS],
    }
  )();

// eslint-disable-next-line max-len
export const getUniqueFilmSimulationsCached: typeof getUniqueFilmSimulations = (...args) =>
  unstable_cache(
    () => getUniqueFilmSimulations(...args),
    [KEY_PHOTOS, KEY_FILM_SIMULATIONS], {
      tags: [KEY_PHOTOS, KEY_FILM_SIMULATIONS],
    }
  )();

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
