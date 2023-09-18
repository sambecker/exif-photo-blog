'use client';

import { useEffect, useState } from 'react';
import {
  Photo,
  ogImageDescriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { BiError } from 'react-icons/bi';
import { absolutePathForPhotoImage, pathForPhoto } from '@/site/paths';
import Spinner from '@/components/Spinner';
import { IMAGE_OG_SIZE } from './image-response';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

export default function PhotoOGTile({
  photo,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
}: {
  photo: Photo
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
}) {
  const [loadingStateInternal, setLoadingStateInternal] =
    useState(loadingStateExternal ?? 'unloaded');

  const loadingState = loadingStateExternal ?? loadingStateInternal;

  useEffect(() => {
    if (
      !loadingStateExternal &&
      loadingStateInternal === 'unloaded'
    ) {
      setLoadingStateInternal('loading');
    }
  }, [loadingStateExternal, loadingStateInternal]);

  const { width, height, ratio } = IMAGE_OG_SIZE;

  return (
    <Link
      key={photo.id}
      href={pathForPhoto(photo)}
      className={cc(
        'group',
        'block w-full rounded-md overflow-hidden',
        'border shadow-sm',
        'border-gray-200 dark:border-gray-800',
        riseOnHover && 'hover:-translate-y-1.5 transition-transform',
      )}
    >
      <div
        className="relative"
        style={{ aspectRatio: ratio }}
      >
        {loadingState === 'loading' &&
          <div className={cc(
            'absolute top-0 left-0 right-0 bottom-0 z-10',
            'flex items-center justify-center',
          )}>
            <Spinner size={40} />
          </div>}
        {loadingState === 'failed' &&
          <div className={cc(
            'absolute top-0 left-0 right-0 bottom-0 z-[11]',
            'flex items-center justify-center',
            'text-red-400',
          )}>
            <BiError size={32} />
          </div>}
        {(loadingState === 'loading' || loadingState === 'loaded') &&
          <img
            alt={`OG Image: ${photo.idShort}`}
            className={cc(
              'absolute top-0 left-0 right-0 bottom-0 z-0',
              'w-full',
              loadingState === 'loading' && 'opacity-0',
              'transition-opacity',
            )}
            src={absolutePathForPhotoImage(photo)}
            width={width}
            height={height}
            onLoad={() => {
              if (onLoad) {
                onLoad();
              } else {
                setLoadingStateInternal('loaded');
              }
            }}
            onError={() => {
              if (onFail) {
                onFail();
              } else {
                setLoadingStateInternal('failed');
              }
              if (retryTime !== undefined) {
                setTimeout(() => {
                  setLoadingStateInternal('loading');
                }, retryTime);
              }
            }}
          />}
      </div>
      <div className={cc(
        'md:text-lg',
        'flex flex-col gap-1 p-3',
        'font-sans leading-none',
        'bg-gray-50 dark:bg-gray-900/50',
        'group-active:bg-gray-50 group-active:dark:bg-gray-900/50',
        'group-hover:bg-gray-100 group-hover:dark:bg-gray-900/70',
        'border-t border-gray-200 dark:border-gray-800',
      )}>
        <div className="text-gray-800 dark:text-white font-medium">
          {titleForPhoto(photo)}
        </div>
        <div className="text-gray-500">
          {ogImageDescriptionForPhoto(photo)}
        </div>
      </div>
    </Link>
  );
};
