'use client';

import { ReactNode } from 'react';
import { Photo, titleForPhoto } from '@/photo';
import Link from 'next/link';
import { AnimationConfig } from '../components/AnimateItems';
import { useAppState } from '@/state/AppState';
import { pathForPhoto } from '@/site/paths';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';
import { clsx } from 'clsx/lite';

export default function PhotoLink({
  photo,
  tag,
  camera,
  simulation,
  scroll,
  prefetch,
  nextPhotoAnimation,
  className,
  children,
}: {
  photo?: Photo
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  scroll?: boolean
  prefetch?: boolean
  nextPhotoAnimation?: AnimationConfig
  className?: string
  children?: ReactNode
}) {
  const { setNextPhotoAnimation } = useAppState();
  
  return (
    photo
      ? <Link
        href={pathForPhoto(photo, tag, camera, simulation)}
        prefetch={prefetch}
        onClick={() => {
          if (nextPhotoAnimation) {
            setNextPhotoAnimation?.(nextPhotoAnimation);
          }
        }}
        className={className}
        scroll={scroll}
      >
        {children ?? titleForPhoto(photo)}
      </Link>
      : <span className={clsx(
        'text-gray-300 dark:text-gray-700 cursor-default',
        className,
      )}>
        {children ?? (photo ? titleForPhoto(photo) : undefined)}
      </span>
  );
};
