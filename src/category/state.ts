import { Photo } from '@/photo';
import { CategoryKey } from '.';
import { createContext, useContext } from 'react';
import { getCountsForCategoriesCachedAction } from './actions';

export type CategoryState = {
  photosByCategory?: Partial<Record<CategoryKey, Photo[]>>
  categoriesWithCounts?:
    Awaited<ReturnType<typeof getCountsForCategoriesCachedAction>>
}

export const CategoryContext = createContext<CategoryState>({});

export const useCategoryState = () => useContext(CategoryContext);
