'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { SelectPhotosContext } from './SelectPhotosState';
import {
  getPathComponents,
  PARAM_SELECT,
  PATH_GRID_INFERRED,
} from '@/app/path';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/app/AppState';
import useClientSearchParams from '@/utility/useClientSearchParams';
import { replacePathWithEvent } from '@/utility/url';
import { isElementPartiallyInViewport } from '@/utility/dom';
import { getPhotoOptionsCountForPathAction } from '@/photo/actions';
import { PhotoQueryOptions } from '@/db';

export const DATA_KEY_PHOTO_GRID = 'data-photo-grid';

export default function SelectPhotosProvider({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter();

  const pathname = usePathname();

  const shouldShowSelectAll = useMemo(() => {
    const { photoId } = getPathComponents(pathname);
    return photoId === undefined;
  }, [pathname]);

  const { isUserSignedIn } = useAppState();
  
  const searchParamsSelect = useClientSearchParams(
    PARAM_SELECT,
    // Only scan urls when admin is signed in
    isUserSignedIn,
  );

  const [canCurrentPageSelectPhotos, setCanCurrentPageSelectPhotos] =
    useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] =
    useState<string[]>([]);
  const [isSelectingAllPhotos, setIsSelectingAllPhotos] =
    useState(false);
  const [selectAllPhotoOptions, setSelectAllPhotoOptions] =
    useState<PhotoQueryOptions>();
  const [selectAllCount, setSelectAllCount] = useState<number>();
  const [isPerformingSelectEdit, setIsPerformingSelectEdit] =
    useState(false);

  const [albumTitles, setAlbumTitles] = useState<string>();
  const [tags, setTags] = useState<string>();
  const [tagErrorMessage, setTagErrorMessage] = useState('');

  const getPhotoGridElements = useCallback(() =>
    document.querySelectorAll(`[${DATA_KEY_PHOTO_GRID}=true]`)
  , []);

  useEffect(() => {
    if (isUserSignedIn) {
      const doesPageHavePhotoGrids = getPhotoGridElements().length > 0;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanCurrentPageSelectPhotos(doesPageHavePhotoGrids);
    }
  }, [pathname, isUserSignedIn, getPhotoGridElements]);

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

  const togglePhotoSelection = useCallback((photoId: string) => {
    if (isSelectingAllPhotos) {
      setSelectedPhotoIds([photoId]);
      setIsSelectingAllPhotos(false);
    } else {
      setSelectedPhotoIds(selectedPhotoIds.includes(photoId)
        ? (selectedPhotoIds ?? []).filter(id => id !== photoId)
        : (selectedPhotoIds ?? []).concat(photoId));
    }
  }, [isSelectingAllPhotos, selectedPhotoIds]);

  const toggleIsSelectingAllPhotos = useCallback(() => {
    setIsSelectingAllPhotos(!isSelectingAllPhotos);
    setSelectedPhotoIds([]);
    if (!isSelectingAllPhotos) {
      getPhotoOptionsCountForPathAction(pathname)
        .then(({ options, count }) => {
          setSelectAllPhotoOptions(options);
          setSelectAllCount(count);
        })
        .catch(() => setIsSelectingAllPhotos(false));
    }
  }, [isSelectingAllPhotos, pathname]);

  useEffect(() => {
    if (isSelectingPhotos) {
      const photoGrids = Array.from(getPhotoGridElements());
      const isSomePhotoGridVisible = photoGrids
        .some(element => isElementPartiallyInViewport(element, -20));
      if (!isSomePhotoGridVisible) {
        photoGrids[0]?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPhotoIds([]);
      setIsSelectingAllPhotos(false);
      setSelectAllPhotoOptions(undefined);
      setSelectAllCount(undefined);
      setAlbumTitles(undefined);
      setTags(undefined);
      setTagErrorMessage('');
    }
  }, [isSelectingPhotos, getPhotoGridElements]);

  return (
    <SelectPhotosContext.Provider value={{
      canCurrentPageSelectPhotos,
      isSelectingPhotos,
      isSelectingAllPhotos,
      shouldShowSelectAll,
      toggleIsSelectingAllPhotos,
      startSelectingPhotos,
      stopSelectingPhotos,
      selectedPhotoIds,
      selectAllPhotoOptions,
      selectAllCount,
      togglePhotoSelection,
      isPerformingSelectEdit,
      setIsPerformingSelectEdit,
      albumTitles,
      setAlbumTitles,
      tags,
      setTags,
      tagErrorMessage,
      setTagErrorMessage,
    }}>
      {children}
    </SelectPhotosContext.Provider>
  );
}
