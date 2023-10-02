import { revalidateTag, unstable_cache } from 'next/cache';
import {
  GetPhotosOptions,
  getPhoto,
  getPhotos,
  getPhotosCount,
  getPhotosCountIncludingHidden,
  getUniqueDevices,
  getUniqueTags,
} from '@/services/postgres';
import { parseCachedPhotosDates, parseCachedPhotoDates } from '@/photo';
import { getBlobPhotoUrls, getBlobUploadUrls } from '@/services/blob';
import { AuthSession } from 'next-auth';

const TAG_PHOTOS        = 'photos';
const TAG_PHOTOS_COUNT  = 'photos-count';
const TAG_TAGS          = 'tags';
const TAG_DEVICES       = 'devices';
const TAG_BLOB          = 'blob';

// eslint-disable-next-line max-len
const getPhotosCacheTagForKey = (
  options: GetPhotosOptions,
  key: keyof GetPhotosOptions,
): string | null => {
  switch (key) {
  // Primitive keys
  case 'sortBy': 
  case 'limit':
  case 'offset':
  case 'tag':
  case 'includeHidden': {
    const value = options[key];
    return value ? `${key}-${value}` : null;
  }
  // Date keys
  case 'takenBefore':
  case 'takenAfterInclusive': {
    const value = options[key];
    return value ? `${key}-${value.toISOString()}` : null;
  }
  // Complex keys
  case 'device': {
    const value = options[key];
    return value ? `${key}-${value.make}-${value.model}` : null;
  }
  }
};

const getPhotosCacheTags = (options: GetPhotosOptions = {}) => {
  const tags: string[] = [];

  Object.keys(options).forEach(key => {
    const tag = getPhotosCacheTagForKey(options, key as keyof GetPhotosOptions);
    if (tag) { tags.push(tag); }
  });

  return tags;
};

const getPhotoCacheTag = (photoId: string) => `photo-${photoId}`;

export const revalidatePhotosTag = () =>
  revalidateTag(TAG_PHOTOS);

export const revalidateTagsTag = () =>
  revalidateTag(TAG_TAGS);

export const revalidateDevicesTag = () =>
  revalidateTag(TAG_DEVICES);

export const revalidateBlobTag = () =>
  revalidateTag(TAG_BLOB);

export const revalidatePhotosAndBlobTag = () => {
  revalidateTag(TAG_PHOTOS);
  revalidateTag(TAG_BLOB);
};

export const revalidateAllTags = () => {
  revalidatePhotosTag();
  revalidateTagsTag();
  revalidateDevicesTag();
  revalidateBlobTag();
};

export const getPhotosCached: typeof getPhotos = (...args) =>
  unstable_cache(
    () => getPhotos(...args),
    [TAG_PHOTOS, ...getPhotosCacheTags(...args)], {
      tags: [TAG_PHOTOS, ...getPhotosCacheTags(...args)],
    }
  )().then(parseCachedPhotosDates);

export const getPhotosCountCached: typeof getPhotosCount = (...args) =>
  unstable_cache(
    () => getPhotosCount(...args),
    [TAG_PHOTOS, TAG_PHOTOS_COUNT], {
      tags: [TAG_PHOTOS, TAG_PHOTOS_COUNT],
    }
  )();

export const getPhotosCountIncludingHiddenCached: typeof getPhotosCount =
  (...args) =>
    unstable_cache(
      () => getPhotosCountIncludingHidden(...args),
      [TAG_PHOTOS, TAG_PHOTOS_COUNT], {
        tags: [TAG_PHOTOS, TAG_PHOTOS_COUNT],
      }
    )();

export const getPhotoCached: typeof getPhoto = (...args) =>
  unstable_cache(
    () => getPhoto(...args),
    [TAG_PHOTOS, getPhotoCacheTag(...args)], {
      tags: [TAG_PHOTOS, getPhotoCacheTag(...args)],
    }
  )().then(photo => photo ? parseCachedPhotoDates(photo) : undefined);

export const getUniqueTagsCached: typeof getUniqueTags = (...args) =>
  unstable_cache(
    () => getUniqueTags(...args),
    [TAG_PHOTOS, TAG_TAGS], {
      tags: [TAG_PHOTOS, TAG_TAGS],
    }
  )();

export const getUniqueDevicesCached: typeof getUniqueDevices = (...args) =>
  unstable_cache(
    () => getUniqueDevices(...args),
    [TAG_PHOTOS, TAG_DEVICES], {
      tags: [TAG_PHOTOS, TAG_DEVICES],
    }
  )();

export const getBlobUploadUrlsCached: typeof getBlobUploadUrls = (...args) =>
  unstable_cache(
    () => getBlobUploadUrls(...args),
    [TAG_BLOB], {
      tags: [TAG_BLOB],
    }
  )();

export const getBlobPhotoUrlsCached: typeof getBlobPhotoUrls = (...args) =>
  unstable_cache(
    () => getBlobPhotoUrls(...args),
    [TAG_BLOB], {
      tags: [TAG_BLOB],
    }
  )();

export const getImageCacheHeadersForAuth = (session: AuthSession | null) => {
  return {
    'Cache-Control': !session?.user
      ? 's-maxage=3600, stale-while-revalidate=59'
      : 's-maxage=1, stale-while-revalidate=59',
  };
};
