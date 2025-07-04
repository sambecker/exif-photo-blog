import { createContext, useContext } from 'react';
import { getCountsForCategoriesCachedAction } from './actions';

export type CategoryState = {
  categoriesWithCounts?:
    Awaited<ReturnType<typeof getCountsForCategoriesCachedAction>>
}

export const CategoryContext = createContext<CategoryState>({});

export const useCategoryState = () => useContext(CategoryContext);
