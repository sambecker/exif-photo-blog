'use client';

import { ReactNode } from 'react';
import { CategoryContext } from './state';
import { getCountsForCategoriesCachedAction } from './actions';
import useSWR from 'swr';

export default function CategoryStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const { data: categoriesWithCounts } = useSWR(
    'getDataForCategories',
    getCountsForCategoriesCachedAction,
  );
  return <CategoryContext.Provider value={{
    categoriesWithCounts,
  }}>
    {children}
  </CategoryContext.Provider>;
}
