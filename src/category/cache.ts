import { unstable_cache } from 'next/cache';
import { getCountsForCategories } from './data';
import { KEY_PHOTOS } from '@/photo/cache';

export const getCountsForCategoriesCached = () =>
  unstable_cache(
    getCountsForCategories,
    [KEY_PHOTOS],
  )();
