'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  Photo,
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
import { toggleFavoritePhotoAction } from './actions';
import { isPhotoFav } from '@/tag';

const LISTENER_KEYUP = 'keyup';

const ANIMATION_LEFT: AnimationConfig = { type: 'left', duration: 0.3 };
const ANIMATION_RIGHT: AnimationConfig = { type: 'right', duration: 0.3 };

export default function PhotoPrevNext({
  photo,
  photos = [],
  className,
  ...categories
}: {
  photo?: Photo
  photos?: Photo[]
  className?: string
} & PhotoSetCategory) {
  const {
    setNextPhotoAnimation,
    shouldRespondToKeyboardCommands,
    isUserSignedIn,
  } = useAppState();

  const photoTitle = photo
    ? photo.title
      ? `'${photo.title}'`
      : 'photo'
    : undefined;

  const toggleFavorite = useCallback(() => {
    if (photo?.id) {
      return toggleFavoritePhotoAction(photo.id);
    }
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

  useEffect(() => {
    if (shouldRespondToKeyboardCommands) {
      const onKeyUp = (e: KeyboardEvent) => {
        switch (e.key.toUpperCase()) {
        case 'ARROWLEFT':
        case 'J':
          if (pathPrevious) {
            setNextPhotoAnimation?.(ANIMATION_RIGHT);
            refPrevious.current?.click();
          }
          break;
        case 'ARROWRIGHT':
        case 'L':
          if (pathNext) {
            setNextPhotoAnimation?.(ANIMATION_LEFT);
            refNext.current?.click();
          }
          break;
        case 'E':
          if (isUserSignedIn) { navigateToPhotoEdit(); }
          break;
        case 'P':
          if (isUserSignedIn && photo && !isPhotoFav(photo)) {
            favoritePhoto();
          }
          break;
        case 'X':
          if (isUserSignedIn && photo && isPhotoFav(photo)) {
            unfavoritePhoto();
          }
          break;
        };
      };
      window.addEventListener(LISTENER_KEYUP, onKeyUp);
      return () => window.removeEventListener(LISTENER_KEYUP, onKeyUp);
    }
  }, [
    shouldRespondToKeyboardCommands,
    setNextPhotoAnimation,
    pathPrevious,
    pathNext,
    isUserSignedIn,
    photoTitle,
    navigateToPhotoEdit,
    photo,
    favoritePhoto,
    unfavoritePhoto,
  ]);
  
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
        <span className="text-extra-extra-dim">
          /
        </span>
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
      </div>
    </div>
  );
};
