'use server';

import { getCountsForCategories } from './data';

export const getCountsForCategoriesAction = async () =>
  getCountsForCategories();
