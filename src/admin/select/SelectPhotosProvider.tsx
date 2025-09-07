'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { SelectPhotosContext } from './SelectPhotosState';
import { PARAM_SELECT, PATH_GRID_INFERRED } from '@/app/path';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/app/AppState';
import useClientSearchParams from '@/utility/useClientSearchParams';

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
    useState(true);

  useEffect(() => {
    setCanCurrentPageSelectPhotos(document
      .querySelector(`[${DATA_KEY_PHOTO_GRID}]`) !== null);
  }, [pathname]);

  const isSelectingPhotos = useMemo(() =>
    isUserSignedIn &&
    searchParamsSelect === 'true'
  , [isUserSignedIn, searchParamsSelect]);
    
  const startSelectingPhotos = useCallback(() => {
    window.history.pushState(
      null,
      '',
      canCurrentPageSelectPhotos
        ? `${pathname}?${PARAM_SELECT}=true`
        : `${PATH_GRID_INFERRED}?batch=true`,
    );
    dispatchEvent(new Event('pushstate'));
  }, [canCurrentPageSelectPhotos, pathname]);
  
  const stopSelectingPhotos = useCallback(() => {
    window.history.pushState(null, '', pathname);
    dispatchEvent(new Event('pushstate'));
  }, [pathname]);

  useEffect(() => {
    if (!isSelectingPhotos) { setSelectedPhotoIds([]); }
  }, [isSelectingPhotos]);

  const [selectedPhotoIds, setSelectedPhotoIds] =
    useState<string[]>([]);

  const [isPerformingSelectEdit, setIsPerformingSelectEdit] =
    useState(false);

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
