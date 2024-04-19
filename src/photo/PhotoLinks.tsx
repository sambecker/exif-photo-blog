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

const LISTENER_KEYUP = 'keyup';

const ANIMATION_LEFT: AnimationConfig = { type: 'left', duration: 0.3 };
const ANIMATION_RIGHT: AnimationConfig = { type: 'right', duration: 0.3 };

export default function PhotoLinks({
  photo,
  photos,
  tag,
  camera,
  simulation,
}: {
  photo: Photo
  photos: Photo[]
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
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
              pathForPhoto(previousPhoto, tag, camera, simulation),
              { scroll: false },
            );
          }
          break;
        case 'ARROWRIGHT':
        case 'L':
          if (nextPhoto) {
            setNextPhotoAnimation?.(ANIMATION_LEFT);
            router.push(
              pathForPhoto(nextPhoto, tag, camera, simulation),
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
  ]);
  
  return (
    <>
      <PhotoLink
        photo={previousPhoto}
        nextPhotoAnimation={ANIMATION_RIGHT}
        tag={tag}
        camera={camera}
        simulation={simulation}
        scroll={false}
        prefetch
      >
        PREV
      </PhotoLink>
      <PhotoLink
        photo={nextPhoto}
        nextPhotoAnimation={ANIMATION_LEFT}
        tag={tag}
        camera={camera}
        simulation={simulation}
        scroll={false}
        prefetch
      >
        NEXT
      </PhotoLink>
    </>
  );
};
