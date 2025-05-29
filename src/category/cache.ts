import { unstable_cache } from 'next/cache';
import { getCountsForCategories, getDataForCategories } from './data';
import { KEY_PHOTOS } from '@/photo/cache';

export const getDataForCategoriesCached = unstable_cache(
  getDataForCategories,
  [KEY_PHOTOS],
);

export const getCountsForCategoriesCached = unstable_cache(
  getCountsForCategories,
  [KEY_PHOTOS],
);
