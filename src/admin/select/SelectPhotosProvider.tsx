'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SelectPhotosContext } from './SelectPhotosState';
import { isElementPartiallyInViewport } from '@/utility/dom';
import { getPhotoGridElements } from '.';

export default function SelectPhotosProvider({
  children,
}: {
  children: ReactNode
}) {  
  const [canCurrentPageSelectPhotos, setCanCurrentPageSelectPhotos] =
    useState(false);
  const [isSelectingPhotos, setIsSelectingPhotos] =
    useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] =
    useState<string[]>([]);
  const [isPerformingSelectEdit, setIsPerformingSelectEdit] =
    useState(false);
  const [startSelectingPhotosPath, setStartSelectingPhotosPath] =
    useState<string>('');
  const [stopSelectingPhotosPath, setStopSelectingPhotosPath] =
    useState<string>('');

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
    }
  }, [isSelectingPhotos]);

  return (
    <SelectPhotosContext.Provider value={{
      canCurrentPageSelectPhotos,
      setCanCurrentPageSelectPhotos,
      isSelectingPhotos,
      setIsSelectingPhotos,
      startSelectingPhotosPath,
      setStartSelectingPhotosPath,
      stopSelectingPhotosPath,
      setStopSelectingPhotosPath,
      selectedPhotoIds,
      setSelectedPhotoIds,
      isPerformingSelectEdit,
      setIsPerformingSelectEdit,
    }}>
      {children}
    </SelectPhotosContext.Provider>
  );
}
