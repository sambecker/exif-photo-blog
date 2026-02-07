import {
  getAlbumFromSlug,
  getAlbumsWithMeta,
  getAlbumTitlesForPhoto,
  getTagsForAlbum,
} from '@/album/query';
import { KEY_ALBUMS, KEY_PHOTOS } from '@/cache';
import { unstable_cache } from 'next/cache';

export const getAlbumFromSlugCached =
  unstable_cache(
    getAlbumFromSlug,
    [KEY_PHOTOS, KEY_ALBUMS],
  );

export const getAlbumTitlesForPhotoCached =
  unstable_cache(
    getAlbumTitlesForPhoto,
    [KEY_PHOTOS, KEY_ALBUMS],
  );

export const getAlbumsWithMetaCached =
  unstable_cache(
    getAlbumsWithMeta,
    [KEY_PHOTOS, KEY_ALBUMS],
  );

export const getTagsForAlbumCached =
  unstable_cache(
    getTagsForAlbum,
    [KEY_PHOTOS, KEY_ALBUMS],
  );
