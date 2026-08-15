'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import {
  EditTitlesContext,
  PhotoTitleEdit,
} from './EditTitlesState';
import {
  doesPathOfferSort,
  isPathGrid,
  PARAM_EDIT_TITLES,
  PATH_FULL_INFERRED,
} from '@/app/path';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/app/AppState';
import useClientSearchParams from '@/utility/useClientSearchParams';
import { replacePathWithEvent } from '@/utility/url';
import { getSortStateFromPath } from '@/photo/sort/path';
import { useAppText } from '@/i18n/state/client';

export const DATA_KEY_PHOTO_LARGE = 'data-photo-large';

const normalize = (value?: string | null) => value ?? '';

export default function EditTitlesProvider({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const appText = useAppText();
  const { isUserSignedIn } = useAppState();

  const searchParamsEditTitles = useClientSearchParams(
    PARAM_EDIT_TITLES,
    // Only scan urls when admin is signed in
    isUserSignedIn,
  );

  const [photoEdits, setPhotoEdits] =
    useState<Record<string, PhotoTitleEdit>>({});
  const [isPerformingUpdate, setIsPerformingUpdate] =
    useState(false);

  const isEditingTitles = useMemo(() =>
    isUserSignedIn &&
    searchParamsEditTitles === 'true'
  , [isUserSignedIn, searchParamsEditTitles]);

  const startEditingTitles = useCallback(() => {
    const hasPhotoLarge = document
      .querySelectorAll(`[${DATA_KEY_PHOTO_LARGE}=true]`)
      .length > 0;

    if (hasPhotoLarge) {
      replacePathWithEvent(`${pathname}?${PARAM_EDIT_TITLES}=true`);
      return;
    }

    if (doesPathOfferSort(pathname)) {
      const { pathGrid, pathFull } =
        getSortStateFromPath(pathname, appText);
      const isOnGridView =
        pathname === pathGrid ||
        isPathGrid(pathname);
      const targetPath = isOnGridView
        ? pathFull
        : pathname;
      if (targetPath === pathname) {
        replacePathWithEvent(`${pathname}?${PARAM_EDIT_TITLES}=true`);
      } else {
        router.push(`${targetPath}?${PARAM_EDIT_TITLES}=true`);
      }
      return;
    }

    router.push(`${PATH_FULL_INFERRED}?${PARAM_EDIT_TITLES}=true`);
  }, [appText, pathname, router]);

  const stopEditingTitles = useCallback(() =>
    replacePathWithEvent(pathname)
  , [pathname]);

  const getPhotoEdit = useCallback((
    photoId: string,
    original: PhotoTitleEdit,
  ): PhotoTitleEdit =>
    photoEdits[photoId] ?? {
      title: normalize(original.title),
      caption: normalize(original.caption),
    }
  , [photoEdits]);

  const setPhotoEdit = useCallback((
    photoId: string,
    edit: Partial<PhotoTitleEdit>,
    original: PhotoTitleEdit,
  ) => {
    setPhotoEdits(prev => {
      const current = prev[photoId] ?? {
        title: normalize(original.title),
        caption: normalize(original.caption),
      };
      const next = {
        title: edit.title !== undefined
          ? edit.title
          : current.title,
        caption: edit.caption !== undefined
          ? edit.caption
          : current.caption,
      };
      const originalTitle = normalize(original.title);
      const originalCaption = normalize(original.caption);
      if (
        next.title === originalTitle &&
        next.caption === originalCaption
      ) {
        const { [photoId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [photoId]: next };
    });
  }, []);

  const clearPhotoEdits = useCallback(() =>
    setPhotoEdits({})
  , []);

  const modifiedPhotoCount = useMemo(() =>
    Object.keys(photoEdits).length
  , [photoEdits]);

  useEffect(() => {
    if (!isEditingTitles) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhotoEdits({});
      setIsPerformingUpdate(false);
    }
  }, [isEditingTitles]);

  return (
    <EditTitlesContext.Provider value={{
      isEditingTitles,
      startEditingTitles,
      stopEditingTitles,
      photoEdits,
      getPhotoEdit,
      setPhotoEdit,
      modifiedPhotoCount,
      isPerformingUpdate,
      setIsPerformingUpdate,
      clearPhotoEdits,
    }}>
      {children}
    </EditTitlesContext.Provider>
  );
}
