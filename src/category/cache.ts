import { unstable_cache } from 'next/cache';
import { getCountsForCategories, getDataForCategories } from './data';
import { KEY_PHOTOS } from '@/photo/cache';
import {
  getCountsForCategoriesCachedAction,
  getDataForCategoriesCachedAction,
} from '@/platforms/immich/category/action';
import { USE_IMMICH_BACKEND } from '@/app/config';

export const getDataForCategoriesCached = USE_IMMICH_BACKEND ?
  getDataForCategoriesCachedAction : unstable_cache(
    getDataForCategories,
    [KEY_PHOTOS],
  );

export const getCountsForCategoriesCached = USE_IMMICH_BACKEND ?
  getCountsForCategoriesCachedAction : unstable_cache(
    getCountsForCategories,
    [KEY_PHOTOS],
  );
