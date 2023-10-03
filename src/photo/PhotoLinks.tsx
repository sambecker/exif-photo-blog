'use client';

import { useEffect } from 'react';
import { Photo, getNextPhoto, getPreviousPhoto } from '@/photo';
import PhotoLink from './PhotoLink';
import { useRouter } from 'next/navigation';
import { pathForPhoto } from '@/site/paths';
import { useAppState } from '@/state';
import { AnimationConfig } from '@/components/AnimateItems';
import { Device } from '@/device';

const LISTENER_KEYUP = 'keyup';

const ANIMATION_LEFT: AnimationConfig = { type: 'left', duration: 0.3 };
const ANIMATION_RIGHT: AnimationConfig = { type: 'right', duration: 0.3 };

export default function PhotoLinks({
  photo,
  photos,
  tag,
  device,
}: {
  photo: Photo
  photos: Photo[]
  tag?: string
  device?: Device
}) {
  const router = useRouter();

  const { setNextPhotoAnimation } = useAppState();

  const previousPhoto = getPreviousPhoto(photo, photos);
  const nextPhoto = getNextPhoto(photo, photos);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toUpperCase()) {
      case 'ARROWLEFT':
      case 'J':
        if (previousPhoto) {
          setNextPhotoAnimation?.(ANIMATION_RIGHT);
          router.push(
            pathForPhoto(previousPhoto, tag, device),
            { scroll: false },
          );
        }
        break;
      case 'ARROWRIGHT':
      case 'L':
        if (nextPhoto) {
          setNextPhotoAnimation?.(ANIMATION_LEFT);
          router.push(
            pathForPhoto(nextPhoto, tag, device),
            { scroll: false },
          );
        }
        break;
      };
    };
    window.addEventListener(LISTENER_KEYUP, onKeyUp);
    return () => window.removeEventListener(LISTENER_KEYUP, onKeyUp);
  }, [
    router,
    setNextPhotoAnimation,
    previousPhoto,
    nextPhoto,
    tag,
    device,
  ]);
  
  return (
    <>
      <PhotoLink
        photo={previousPhoto}
        nextPhotoAnimation={ANIMATION_RIGHT}
        tag={tag}
        device={device}
        prefetch
      >
        PREV
      </PhotoLink>
      <PhotoLink
        photo={nextPhoto}
        nextPhotoAnimation={ANIMATION_LEFT}
        tag={tag}
        device={device}
        prefetch
      >
        NEXT
      </PhotoLink>
    </>
  );
};
