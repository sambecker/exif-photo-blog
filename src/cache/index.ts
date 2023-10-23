import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
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
} from '@/services/postgres';
import { parseCachedPhotosDates, parseCachedPhotoDates } from '@/photo';
import { getBlobPhotoUrls, getBlobUploadUrls } from '@/services/blob';
import { AuthSession } from 'next-auth';
import { Camera, createCameraKey } from '@/camera';
import { PATHS_ADMIN, PATHS_TO_CACHE } from '@/site/paths';

const KEY_PHOTOS            = 'photos';
const KEY_PHOTOS_COUNT      = `${KEY_PHOTOS}-count`;
const KEY_PHOTOS_DATE_RANGE = `${KEY_PHOTOS}-date-range`;
const KEY_TAGS              = 'tags';
const KEY_CAMERAS           = 'cameras';
const KEY_BLOB              = 'blob';
// Temporary key to clear caches on forked blogs
const KEY_NEW_QUERY         = 'new-query';

// eslint-disable-next-line max-len
const getPhotosCacheKeyForOption = (
  options: GetPhotosOptions,
  option: keyof GetPhotosOptions,
): string | null => {
  switch (option) {
  // Primitive keys
  case 'sortBy': 
  case 'limit':
  case 'offset':
  case 'tag':
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

const getPhotoTagCountKey = (tag: string) =>
  `${KEY_PHOTOS_COUNT}-${KEY_TAGS}-${tag}`;

const getPhotoCameraCountKey = (camera: Camera) =>
  `${KEY_PHOTOS_COUNT}-${KEY_CAMERAS}-${createCameraKey(camera)}`;

const getPhotoTagDateRangeKey = (tag: string) =>
  `${KEY_PHOTOS_DATE_RANGE}-${KEY_TAGS}-${tag}`;

const getPhotoCameraDateRangeKey = (camera: Camera) =>
  `${KEY_PHOTOS_DATE_RANGE}-${KEY_CAMERAS}-${createCameraKey(camera)}`;

export const revalidatePhotosKey = () =>
  revalidateTag(KEY_PHOTOS);

export const revalidateTagsKey = () =>
  revalidateTag(KEY_TAGS);

export const revalidateCamerasKey = () =>
  revalidateTag(KEY_CAMERAS);

export const revalidateBlobKey = () =>
  revalidateTag(KEY_BLOB);

export const revalidatePhotosAndBlobKeys = () => {
  revalidatePhotosKey();
  revalidateBlobKey();
};

export const revalidateAllKeys = () => {
  revalidatePhotosAndBlobKeys();
  revalidateTagsKey();
  revalidateCamerasKey();
};

export const revalidateAllKeysAndPaths = () => {
  revalidateAllKeys();
  PATHS_TO_CACHE.forEach(path => revalidatePath(path));
};

export const revalidateAdminPaths = () => {
  PATHS_ADMIN.forEach(path => revalidatePath(path));
};

export const getPhotosCached: typeof getPhotos = (...args) =>
  unstable_cache(
    () => getPhotos(...args),
    [KEY_PHOTOS, ...getPhotosCacheKeys(...args)], {
      tags: [KEY_PHOTOS, ...getPhotosCacheKeys(...args)],
    }
  )().then(parseCachedPhotosDates);

export const getPhotosCountCached: typeof getPhotosCount = (...args) =>
  unstable_cache(
    () => getPhotosCount(...args),
    [KEY_PHOTOS, KEY_PHOTOS_COUNT], {
      tags: [KEY_PHOTOS, KEY_PHOTOS_COUNT],
    }
  )();

export const getPhotosCountIncludingHiddenCached: typeof getPhotosCount =
  (...args) =>
    unstable_cache(
      () => getPhotosCountIncludingHidden(...args),
      [KEY_PHOTOS, KEY_PHOTOS_COUNT], {
        tags: [KEY_PHOTOS, KEY_PHOTOS_COUNT],
      }
    )();

export const getPhotosTagCountCached: typeof getPhotosTagCount = (...args) =>
  unstable_cache(
    () => getPhotosTagCount(...args),
    [KEY_PHOTOS, getPhotoTagCountKey(...args)], {
      tags: [KEY_PHOTOS, getPhotoTagCountKey(...args)],
    }
  )();

// eslint-disable-next-line max-len
export const getPhotosCameraCountCached: typeof getPhotosCameraCount = (...args) =>
  unstable_cache(
    () => getPhotosCameraCount(...args),
    [KEY_PHOTOS, getPhotoCameraCountKey(...args)], {
      tags: [KEY_PHOTOS, getPhotoCameraCountKey(...args)],
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
    [KEY_PHOTOS, KEY_TAGS, KEY_NEW_QUERY], {
      tags: [KEY_PHOTOS, KEY_TAGS, KEY_NEW_QUERY],
    }
  )();

// eslint-disable-next-line max-len
export const getUniqueTagsHiddenCached: typeof getUniqueTagsHidden = (...args) =>
  unstable_cache(
    () => getUniqueTagsHidden(...args),
    [KEY_PHOTOS, KEY_TAGS, KEY_NEW_QUERY], {
      tags: [KEY_PHOTOS, KEY_TAGS, KEY_NEW_QUERY],
    }
  )();

export const getUniqueCamerasCached: typeof getUniqueCameras = (...args) =>
  unstable_cache(
    () => getUniqueCameras(...args),
    [KEY_PHOTOS, KEY_CAMERAS, KEY_NEW_QUERY], {
      tags: [KEY_PHOTOS, KEY_CAMERAS, KEY_NEW_QUERY],
    }
  )();

export const getBlobUploadUrlsCached: typeof getBlobUploadUrls = (...args) =>
  unstable_cache(
    () => getBlobUploadUrls(...args),
    [KEY_BLOB], {
      tags: [KEY_BLOB],
    }
  )();

export const getBlobPhotoUrlsCached: typeof getBlobPhotoUrls = (...args) =>
  unstable_cache(
    () => getBlobPhotoUrls(...args),
    [KEY_BLOB], {
      tags: [KEY_BLOB],
    }
  )();

export const getImageCacheHeadersForAuth = (session: AuthSession | null) => {
  return {
    'Cache-Control': !session?.user
      ? 's-maxage=3600, stale-while-revalidate=59'
      : 's-maxage=1, stale-while-revalidate=59',
  };
};
