'use client';

import { useEffect } from 'react';
import {
  Photo,
  getNextPhoto,
  getPreviousPhoto,
} from '@/photo';
import { PhotoSetCategory } from '../category';
import PhotoLink from './PhotoLink';
import { useRouter } from 'next/navigation';
import { pathForPhoto } from '@/app/paths';
import { useAppState } from '@/state/AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import { clsx } from 'clsx/lite';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
  const router = useRouter();

  const {
    setNextPhotoAnimation,
    shouldRespondToKeyboardCommands,
  } = useAppState();

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
            router.push(pathPrevious, { scroll: false });
          }
          break;
        case 'ARROWRIGHT':
        case 'L':
          if (pathNext) {
            setNextPhotoAnimation?.(ANIMATION_LEFT);
            router.push(pathNext, { scroll: false });
          }
          break;
        };
      };
      window.addEventListener(LISTENER_KEYUP, onKeyUp);
      return () => window.removeEventListener(LISTENER_KEYUP, onKeyUp);
    }
  }, [
    router,
    shouldRespondToKeyboardCommands,
    setNextPhotoAnimation,
    pathPrevious,
    pathNext,
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
