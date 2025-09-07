'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { SelectPhotosContext } from './SelectPhotosState';
import { PARAM_SELECT, PATH_GRID_INFERRED } from '@/app/path';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/app/AppState';
import useClientSearchParams from '@/utility/useClientSearchParams';
import { pushPathWithEvent } from '@/utility/url';

export const DATA_KEY_PHOTO_GRID = 'data-photo-grid';

export default function SelectPhotosProvider({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname();

  const { isUserSignedIn } = useAppState();
  
  const searchParamsSelect = useClientSearchParams(PARAM_SELECT);

  const [canCurrentPageSelectPhotos, setCanCurrentPageSelectPhotos] =
    useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] =
    useState<string[]>([]);
  const [isPerformingSelectEdit, setIsPerformingSelectEdit] =
    useState(false);

  useEffect(() => {
    setCanCurrentPageSelectPhotos(document
      .querySelector(`[${DATA_KEY_PHOTO_GRID}]`) !== null);
  }, [pathname]);

  const isSelectingPhotos = useMemo(() =>
    isUserSignedIn &&
    searchParamsSelect === 'true'
  , [isUserSignedIn, searchParamsSelect]);
    
  const startSelectingPhotos = useCallback(() =>
    pushPathWithEvent(canCurrentPageSelectPhotos
      ? `${pathname}?${PARAM_SELECT}=true`
      // Redirect to grid if current view does not support photo selection
      : `${PATH_GRID_INFERRED}?${PARAM_SELECT}=true`)
  , [canCurrentPageSelectPhotos, pathname]);
  
  const stopSelectingPhotos = useCallback(() =>
    pushPathWithEvent(pathname)
  , [pathname]);

  useEffect(() => {
    if (!isSelectingPhotos) {
      setSelectedPhotoIds([]);
    }
  }, [isSelectingPhotos]);

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
