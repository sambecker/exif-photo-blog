'use server';

import { getCountsForCategoriesCached } from './cache';

export const getCountsForCategoriesCachedAction = async () =>
  getCountsForCategoriesCached();
