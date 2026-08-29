import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';
import { getPhotos, getPhotosMeta } from '@/photo/query';

/** Preview row count for Command-K; full set lives on /q/[query]. */
export const COMMAND_K_PHOTO_LIMIT = 10;

/**
 * Shared photo-query fetch used by Command-K and /q/[query].
 * Same `{ query }` options → same WHERE (title/caption/semantic ILIKE).
 */
export const getPhotosQueryData = ({
  query,
  limit,
}: {
  query: string
  limit?: number
}) =>
  Promise.all([
    getPhotos({ query, limit }),
    getPhotosMeta({ query }),
  ]);

export const getPhotosQueryDataCached = ({
  query,
  limit,
}: {
  query: string
  limit?: number
}) =>
  Promise.all([
    getPhotosCached({ query, limit }),
    getPhotosMetaCached({ query }),
  ]);
