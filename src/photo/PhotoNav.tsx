'use client';

import { useEffect } from 'react';
import { Photo, getNextPhoto, getPreviousPhoto } from '@/photo';
import PhotoLink from './PhotoLink';
import { useRouter } from 'next/navigation';
import { pathForPhoto } from '@/site/paths';
import { useAppState } from '@/state/AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';
import { SHOW_PHOTO_TITLE_FALLBACK_TEXT } from '@/site/config';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { clsx } from 'clsx/lite';

const LISTENER_KEYUP = 'keyup';

const ANIMATION_LEFT: AnimationConfig = { type: 'left', duration: 0.3 };
const ANIMATION_RIGHT: AnimationConfig = { type: 'right', duration: 0.3 };

export default function PhotoNav({
  photo,
  photos,
  className,
  tag,
  camera,
  simulation,
  focal,
  prefetch,
}: {
  photo: Photo
  photos: Photo[]
  className?: string
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  focal?: number
  prefetch?: boolean
}) {
  const router = useRouter();

  const {
    setNextPhotoAnimation,
    shouldRespondToKeyboardCommands,
  } = useAppState();

  const previousPhoto = getPreviousPhoto(photo, photos);
  const nextPhoto = getNextPhoto(photo, photos);

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
      <PhotoLink
        photo={previousPhoto}
        nextPhotoAnimation={ANIMATION_RIGHT}
        tag={tag}
        camera={camera}
        simulation={simulation}
        focal={focal}
        scroll={false}
        prefetch
      >
        <span className="group inline-flex gap-1 items-center">
          <BiChevronLeft
            className={clsx(
              'text-[1.25rem] transition-transform',
              'group-hover:-translate-x-1',
            )}
          />
          PREV
        </span>
      </PhotoLink>
      <div className="grow text-center">
        {(photo.title || SHOW_PHOTO_TITLE_FALLBACK_TEXT) &&
          <PhotoLink
            photo={photo}
            className="uppercase font-bold"
            prefetch={prefetch}
          />}
      </div>
      <PhotoLink
        photo={nextPhoto}
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
          <BiChevronRight
            className={clsx(
              'text-[1.25rem] transition-transform',
              'group-hover:translate-x-1',
            )}
          />
        </span>
      </PhotoLink>
    </div>
  );
};
