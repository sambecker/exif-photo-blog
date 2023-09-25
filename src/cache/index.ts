import type { Session } from 'next-auth/types';
import { revalidateTag, unstable_cache } from 'next/cache';
import {
  GetPhotosOptions,
  getPhoto,
  getPhotos,
  getPhotosCount,
  getPhotosCountIncludingHidden,
  getUniqueTags,
} from '@/services/postgres';
import { parseCachedPhotosDates, parseCachedPhotoDates } from '@/photo';
import { getBlobPhotoUrls, getBlobUploadUrls } from '@/services/blob';

const TAG_PHOTOS        = 'photos';
const TAG_PHOTOS_COUNT  = 'photos-count';
const TAG_TAGS          = 'tags';
const TAG_BLOB          = 'blob';

const getPhotosCacheTags = (options: GetPhotosOptions = {}) => {
  const tags = [];
  
  const {
    sortBy,
    limit,
    offset,
    tag,
    takenAfterInclusive,
    takenBefore,
    includeHidden,
  } = options;

  if (sortBy !== undefined) { tags.push(`sortBy-${sortBy}`); }
  if (limit !== undefined) { tags.push(`limit-${limit}`); }
  if (offset !== undefined) { tags.push(`offset-${offset}`); }
  if (tag !== undefined) { tags.push(`tag-${tag}`); }
  // eslint-disable-next-line max-len
  if (takenBefore !== undefined) { tags.push(`takenBefore-${takenBefore.toISOString()}`); }
  // eslint-disable-next-line max-len
  if (takenAfterInclusive !== undefined) { tags.push(`takenAfterInclusive-${takenAfterInclusive.toISOString()}`); }
  // eslint-disable-next-line max-len
  if (includeHidden !== undefined) { tags.push(`includeHidden-${includeHidden}`); }

  return tags;
};

const getPhotoCacheTag = (photoId: string) => `photo-${photoId}`;

export const revalidatePhotosTag = () =>
  revalidateTag(TAG_PHOTOS);

export const revalidateBlobTag = () =>
  revalidateTag(TAG_BLOB);

export const revalidatePhotosAndBlobTag = () => {
  revalidateTag(TAG_PHOTOS);
  revalidateTag(TAG_BLOB);
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

export const getImageCacheHeadersForAuth = (session?: Session) => {
  return {
    'Cache-Control': !session?.user
      ? 's-maxage=3600, stale-while-revalidate=59'
      : 's-maxage=1, stale-while-revalidate=59',
  };
};
