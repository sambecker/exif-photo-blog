'use client';

import { useCallback, useRef } from 'react';
import {
  Photo,
  downloadFileNameForPhoto,
  getNextPhoto,
  getPreviousPhoto,
} from '@/photo';
import { PhotoSetCategory } from '../category';
import PhotoLink from './PhotoLink';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/app/paths';
import { useAppState } from '@/state/AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import { clsx } from 'clsx/lite';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useNavigateOrRunActionWithToast
  from '@/components/useNavigateOrRunActionWithToast';
import {
  deletePhotoAction,
  syncPhotoAction,
  toggleFavoritePhotoAction,
} from './actions';
import { isPhotoFav } from '@/tag';
import Tooltip from '@/components/Tooltip';
import {
  ALLOW_PUBLIC_DOWNLOADS,
  SHOW_KEYBOARD_SHORTCUT_TOOLTIPS,
} from '@/app/config';
import { downloadFileFromBrowser } from '@/utility/url';
import useKeydownHandler from '@/utility/useKeydownHandler';
import { KEY_COMMANDS } from './key-commands';
import { syncPhotoConfirmText } from '@/admin/confirm';

const ANIMATION_LEFT: AnimationConfig = { type: 'left', duration: 0.3 };
const ANIMATION_RIGHT: AnimationConfig = { type: 'right', duration: 0.3 };

export default function PhotoPrevNextActions({
  photo,
  photos = [],
  className,
  hasAiTextGeneration,
  ...categories
}: {
  photo?: Photo
  photos?: Photo[]
  className?: string
  hasAiTextGeneration: boolean
} & PhotoSetCategory) {
  const { setNextPhotoAnimation, isUserSignedIn } = useAppState();

  const photoTitle = photo
    ? photo.title
      ? `'${photo.title}'`
      : 'photo'
    : undefined;
  const downloadUrl = photo?.url;
  const downloadFileName = photo
    ? downloadFileNameForPhoto(photo)
    : undefined;

  const toggleFavorite = useCallback(() => {
    if (photo?.id) { return toggleFavoritePhotoAction(photo.id); }
  }, [photo?.id]);

  const navigateToPhotoEdit = useNavigateOrRunActionWithToast({
    pathOrAction: photo ? pathForAdminPhotoEdit(photo) : undefined,
    toastMessage: `Editing ${photoTitle} ...`,
  });

  const favoritePhoto = useNavigateOrRunActionWithToast({
    pathOrAction: toggleFavorite,
    toastMessage: `Favoriting ${photoTitle} ...`,
  });

  const unfavoritePhoto = useNavigateOrRunActionWithToast({
    pathOrAction: toggleFavorite,
    toastMessage: `Unfavoriting ${photoTitle} ...`,
  });

  const syncPhoto = useNavigateOrRunActionWithToast({
    pathOrAction: useCallback(() => {
      if (photo?.id) { return syncPhotoAction(photo.id); }
    }, [photo?.id]),
    toastMessage: `Syncing ${photoTitle} ...`,
  });

  const deletePhoto = useNavigateOrRunActionWithToast({
    pathOrAction: useCallback(() => {
      if (photo?.id && photo.url) {
        return deletePhotoAction(photo.id, photo.url, true);
      }
    }, [photo?.id, photo?.url]),
    toastMessage: `Deleting ${photoTitle} ...`,
  });

  const refPrevious = useRef<HTMLAnchorElement | null>(null);
  const refNext = useRef<HTMLAnchorElement | null>(null);

  const previousPhoto = photo ? getPreviousPhoto(photo, photos) : undefined;
  const nextPhoto = photo ? getNextPhoto(photo, photos) : undefined;

  const pathPrevious = previousPhoto
    ? pathForPhoto({ photo: previousPhoto, ...categories })
    : undefined;

  const pathNext = nextPhoto
    ? pathForPhoto({ photo: nextPhoto, ...categories })
    : undefined;

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.metaKey) {
      switch (e.key.toUpperCase()) {
      case KEY_COMMANDS.delete[1]:
        if (isUserSignedIn) {
          deletePhoto();
        }
        break;
      }
    } else {
      switch (e.key.toUpperCase()) {
      // Public commands
      case KEY_COMMANDS.prev[0]:
      case KEY_COMMANDS.prev[1]:
        if (pathPrevious) {
          setNextPhotoAnimation?.(ANIMATION_RIGHT);
          refPrevious.current?.click();
        }
        break;
      case KEY_COMMANDS.next[0]:
      case KEY_COMMANDS.next[1]:
        if (pathNext) {
          setNextPhotoAnimation?.(ANIMATION_LEFT);
          refNext.current?.click();
        }
        break;
      // Admin commands
      case KEY_COMMANDS.edit:
        if (isUserSignedIn) {
          navigateToPhotoEdit();
        }
        break;
      case KEY_COMMANDS.favorite:
        if (isUserSignedIn && photo && !isPhotoFav(photo)) {
          favoritePhoto();
        }
        break;
      case KEY_COMMANDS.unfavorite:
        if (isUserSignedIn && photo && isPhotoFav(photo)) {
          unfavoritePhoto();
        }
        break;
      case KEY_COMMANDS.download:
        if (
          (isUserSignedIn || ALLOW_PUBLIC_DOWNLOADS) &&
          downloadUrl &&
          downloadFileName
        ) {
          downloadFileFromBrowser(downloadUrl, downloadFileName);
        }
        break;
      case KEY_COMMANDS.sync:
        if (
          isUserSignedIn &&
          photo &&
          window.confirm(syncPhotoConfirmText(photo, hasAiTextGeneration))
        ) {
          syncPhoto();
        }
        break;
      };
    }
  }, [
    setNextPhotoAnimation,
    pathPrevious,
    pathNext,
    isUserSignedIn,
    navigateToPhotoEdit,
    photo,
    favoritePhoto,
    unfavoritePhoto,
    downloadUrl,
    downloadFileName,
    syncPhoto,
    deletePhoto,
    hasAiTextGeneration,
  ]);
  useKeydownHandler({ onKeyDown });

  return (
    <div className={clsx(
      'flex items-center',
      className,
    )}>
      <div className={clsx(
        'h-4',
        'flex gap-2 select-none',
        // Fixes alignment issue when switching from chevrons to text
        'items-center sm:items-start',
        '*:select-none',
      )}>
        <Tooltip {...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
          content: 'Previous',
          keyCommand: KEY_COMMANDS.prev[0],
        }}>
          <PhotoLink
            {...categories}
            ref={refPrevious}
            photo={previousPhoto}
            nextPhotoAnimation={ANIMATION_RIGHT}
            scroll={false}
            loaderType="badge"
            prefetch
          >
            <FiChevronLeft className="sm:hidden text-[1.1rem]" />
            <span className="hidden sm:inline-block">PREV</span>
          </PhotoLink>
        </Tooltip>
        <span className="text-extra-extra-dim">
          /
        </span>
        <Tooltip {...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
          content: 'Next',
          keyCommand: KEY_COMMANDS.next[0],
        }}>
          <PhotoLink
            {...categories}
            ref={refNext}
            photo={nextPhoto}
            nextPhotoAnimation={ANIMATION_LEFT}
            scroll={false}
            loaderType="badge"
            prefetch
          >
            <FiChevronRight className="sm:hidden text-[1.1rem]" />
            <span className="hidden sm:inline-block">NEXT</span>
          </PhotoLink>
        </Tooltip>
      </div>
    </div>
  );
};
