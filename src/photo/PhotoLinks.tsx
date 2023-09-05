'use client';

import { useEffect } from 'react';
import { Photo, getNextPhoto, getPreviousPhoto } from '@/photo';
import PhotoLink from './PhotoLink';
import { usePathname, useRouter } from 'next/navigation';
import { isRoutePhotoShare, routeForPhoto } from '@/site/routes';
import { useAppState } from '@/state';
import { AnimationConfig } from '@/components/AnimateItems';

const ANIMATION_LEFT: AnimationConfig = { type: 'left', duration: 0.3 };
const ANIMATION_RIGHT: AnimationConfig = { type: 'right', duration: 0.3 };

export default function PhotoLinks({
  photo,
  photos,
}: {
  photo: Photo
  photos: Photo[]
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { setNextPhotoAnimation } = useAppState();

  const isRouteShare = isRoutePhotoShare(pathname);
  const previousPhoto = getPreviousPhoto(photo, photos);
  const nextPhoto = getNextPhoto(photo, photos);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toUpperCase()) {
      case 'ARROWLEFT':
      case 'J':
        if (previousPhoto) {
          setNextPhotoAnimation?.(ANIMATION_RIGHT);
          router.push(routeForPhoto(previousPhoto, isRouteShare));
        }
        break;
      case 'ARROWRIGHT':
      case 'L':
        if (nextPhoto) {
          setNextPhotoAnimation?.(ANIMATION_LEFT);
          router.push(routeForPhoto(nextPhoto, isRouteShare));
        }
        break;
      case 'ESCAPE':
        router.push('/grid');
        break;
      };
    };
    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, [router, setNextPhotoAnimation, previousPhoto, nextPhoto, isRouteShare]);
  
  return (
    <>
      <PhotoLink
        photo={previousPhoto}
        nextPhotoAnimation={ANIMATION_RIGHT}
        prefetch
      >
        PREV
      </PhotoLink>
      <PhotoLink
        photo={nextPhoto}
        nextPhotoAnimation={ANIMATION_LEFT}
        prefetch
      >
        NEXT
      </PhotoLink>
    </>
  );
};
