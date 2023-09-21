'use client';

import { useEffect } from 'react';
import { Photo, getNextPhoto, getPreviousPhoto } from '@/photo';
import PhotoLink from './PhotoLink';
import { useRouter } from 'next/navigation';
import { pathForPhoto } from '@/site/paths';
import { useAppState } from '@/state';
import { AnimationConfig } from '@/components/AnimateItems';

const ANIMATION_LEFT: AnimationConfig = { type: 'left', duration: 0.3 };
const ANIMATION_RIGHT: AnimationConfig = { type: 'right', duration: 0.3 };

export default function PhotoLinks({
  photo,
  photos,
  tag,
}: {
  photo: Photo
  photos: Photo[]
  tag?: string
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
          router.push(pathForPhoto(previousPhoto, tag), { scroll: false });
        }
        break;
      case 'ARROWRIGHT':
      case 'L':
        if (nextPhoto) {
          setNextPhotoAnimation?.(ANIMATION_LEFT);
          router.push(pathForPhoto(nextPhoto, tag), { scroll: false });
        }
        break;
      case 'ESCAPE':
        router.push('/grid');
        break;
      };
    };
    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, [router, setNextPhotoAnimation, previousPhoto, nextPhoto, tag]);
  
  return (
    <>
      <PhotoLink
        photo={previousPhoto}
        nextPhotoAnimation={ANIMATION_RIGHT}
        tag={tag}
        prefetch
      >
        PREV
      </PhotoLink>
      <PhotoLink
        photo={nextPhoto}
        nextPhotoAnimation={ANIMATION_LEFT}
        tag={tag}
        prefetch
      >
        NEXT
      </PhotoLink>
    </>
  );
};
