'use client';

import { ReactNode } from 'react';
import { Photo } from '@/photo';
import Link from 'next/link';
import { AnimationConfig } from '../components/AnimateItems';
import { useAppState } from '@/state';
import { routeForPhoto } from '@/site/routes';

export default function PhotoLink({
  photo,
  prefetch,
  nextPhotoAnimation,
  children,
}: {
  photo?: Photo
  prefetch?: boolean
  nextPhotoAnimation?: AnimationConfig
  children: ReactNode
}) {
  const { setNextPhotoAnimation } = useAppState();
  
  return (
    photo
      ? <Link
        href={routeForPhoto(photo)}
        prefetch={prefetch}
        onClick={() => {
          if (nextPhotoAnimation) {
            setNextPhotoAnimation?.(nextPhotoAnimation);
          }
        }}
      >
        {children}
      </Link>
      : <span className="text-gray-300 dark:text-gray-700 cursor-default">
        {children}
      </span>
  );
};
