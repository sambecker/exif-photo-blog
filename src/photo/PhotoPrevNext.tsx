'use client';

import { useEffect } from 'react';
import {
  Photo,
  PhotoSetAttributes,
  getNextPhoto,
  getPreviousPhoto,
} from '@/photo';
import PhotoLink from './PhotoLink';
import { useRouter } from 'next/navigation';
import { pathForPhoto } from '@/site/paths';
import { useAppState } from '@/state/AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import { clsx } from 'clsx/lite';

const LISTENER_KEYUP = 'keyup';

const ANIMATION_LEFT: AnimationConfig = { type: 'left', duration: 0.3 };
const ANIMATION_RIGHT: AnimationConfig = { type: 'right', duration: 0.3 };

export default function PhotoPrevNext({
  photo,
  photos = [],
  className,
  tag,
  camera,
  simulation,
  focal,
}: {
  photo?: Photo
  photos?: Photo[]
  className?: string
} & PhotoSetAttributes) {
  const router = useRouter();

  const {
    setNextPhotoAnimation,
    shouldRespondToKeyboardCommands,
  } = useAppState();

  const previousPhoto = photo ? getPreviousPhoto(photo, photos) : undefined;
  const nextPhoto = photo ? getNextPhoto(photo, photos) : undefined;

  useEffect(() => {
    if (shouldRespondToKeyboardCommands) {
      const onKeyUp = (e: KeyboardEvent) => {
        switch (e.key.toUpperCase()) {
        case 'ARROWLEFT':
        case 'J':
          if (previousPhoto) {
            setNextPhotoAnimation?.(ANIMATION_RIGHT);
            router.push(
              pathForPhoto({
                photo: previousPhoto,
                tag,
                camera,
                simulation,
                focal,
              }),
              { scroll: false },
            );
          }
          break;
        case 'ARROWRIGHT':
        case 'L':
          if (nextPhoto) {
            setNextPhotoAnimation?.(ANIMATION_LEFT);
            router.push(
              pathForPhoto({
                photo: nextPhoto,
                tag,
                camera, 
                simulation,
                focal,
              }),
              { scroll: false },
            );
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
    previousPhoto,
    nextPhoto,
    tag,
    camera,
    simulation,
    focal,
  ]);
  
  return (
    <div className={clsx(
      'flex items-center',
      className,
    )}>
      <div className="flex items-center gap-2">
        <PhotoLink
          photo={previousPhoto}
          className="select-none"
          nextPhotoAnimation={ANIMATION_RIGHT}
          tag={tag}
          camera={camera}
          simulation={simulation}
          focal={focal}
          scroll={false}
          prefetch
        >
          <span className="group inline-flex gap-1 items-center">
            PREV
          </span>
        </PhotoLink>
        <span className="text-extra-extra-dim">/</span>
        <PhotoLink
          photo={nextPhoto}
          className="select-none"
          nextPhotoAnimation={ANIMATION_LEFT}
          tag={tag}
          camera={camera}
          simulation={simulation}
          focal={focal}
          scroll={false}
          prefetch
        >
          <span className="group inline-flex gap-1 items-center">
            NEXT
          </span>
        </PhotoLink>
      </div>
    </div>
  );
};
