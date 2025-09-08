'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { SelectPhotosContext } from './SelectPhotosState';
import { PARAM_SELECT, PATH_GRID_INFERRED } from '@/app/path';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/app/AppState';
import useClientSearchParams from '@/utility/useClientSearchParams';
import { replacePathWithEvent } from '@/utility/url';
import { isElementPartiallyInViewport } from '@/utility/dom';

export const DATA_KEY_PHOTO_GRID = 'data-photo-grid';

export default function SelectPhotosProvider({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter();

  const pathname = usePathname();

  const { isUserSignedIn } = useAppState();
  
  const searchParamsSelect = useClientSearchParams(PARAM_SELECT);

  const [canCurrentPageSelectPhotos, setCanCurrentPageSelectPhotos] =
    useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] =
    useState<string[]>([]);
  const [isPerformingSelectEdit, setIsPerformingSelectEdit] =
    useState(false);

  const getPhotoGridElements = useCallback(() =>
    document.querySelectorAll(`[${DATA_KEY_PHOTO_GRID}]`)
  , []);

  useEffect(() => {
    const doesPageHavePhotoGrids = getPhotoGridElements().length > 0;
    setCanCurrentPageSelectPhotos(doesPageHavePhotoGrids);
  }, [pathname, getPhotoGridElements]);

  const isSelectingPhotos = useMemo(() =>
    isUserSignedIn &&
    searchParamsSelect === 'true'
  , [isUserSignedIn, searchParamsSelect]);
    
  const startSelectingPhotos = useCallback(() =>
    canCurrentPageSelectPhotos
      // Use replacePathWithEvent because only query params change
      ? replacePathWithEvent(`${pathname}?${PARAM_SELECT}=true`)
      // Redirect to grid if current view does not support photo selection
      : router.push(`${PATH_GRID_INFERRED}?${PARAM_SELECT}=true`)
  , [router, canCurrentPageSelectPhotos, pathname]);
  
  const stopSelectingPhotos = useCallback(() =>
    replacePathWithEvent(pathname)
  , [pathname]);

  useEffect(() => {
    if (isSelectingPhotos) {
      const photoGrids = Array.from(getPhotoGridElements());
      const isSomePhotoGridVisible = photoGrids
        .some(element => isElementPartiallyInViewport(element, -20));
      if (!isSomePhotoGridVisible) {
        photoGrids[0]?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setSelectedPhotoIds([]);
    }
  }, [isSelectingPhotos, getPhotoGridElements]);

  return (
    <SelectPhotosContext.Provider value={{
      canCurrentPageSelectPhotos,
      isSelectingPhotos,
      startSelectingPhotos,
      stopSelectingPhotos,
      selectedPhotoIds,
      setSelectedPhotoIds,
      isPerformingSelectEdit,
      setIsPerformingSelectEdit,
    }}>
      {children}
    </SelectPhotosContext.Provider>
  );
}
