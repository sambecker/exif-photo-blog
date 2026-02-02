'use client';

import { getPhotoGridElements } from '@/admin/select';
import { PARAM_SELECT, PATH_GRID_INFERRED } from '@/app/path';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSelectPhotosState } from './SelectPhotosState';

export default function SelectPhotosListener() {
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const {
    canCurrentPageSelectPhotos,
    setCanCurrentPageSelectPhotos,
    setIsSelectingPhotos,
    setStartSelectingPhotosPath,
    setStopSelectingPhotosPath,
  } = useSelectPhotosState();

  useEffect(() =>
    setCanCurrentPageSelectPhotos?.(getPhotoGridElements().length > 0)
  , [pathname, searchParams, setCanCurrentPageSelectPhotos]);

  const hasParamSelect = searchParams.has(PARAM_SELECT);
  useEffect(() =>
    setIsSelectingPhotos?.(hasParamSelect)
  , [hasParamSelect, setIsSelectingPhotos]);

  useEffect(() =>
    setStartSelectingPhotosPath?.(canCurrentPageSelectPhotos
      ? `${pathname}?${PARAM_SELECT}=true`
      : `${PATH_GRID_INFERRED}?${PARAM_SELECT}=true`)
  , [pathname, setStartSelectingPhotosPath, canCurrentPageSelectPhotos]);

  useEffect(() =>
    setStopSelectingPhotosPath?.(pathname)
  , [pathname, setStopSelectingPhotosPath]);

  return null;
}
