'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx/lite';
import { BiError } from 'react-icons/bi';
import Spinner from '@/components/Spinner';
import { IMAGE_OG_DIMENSION } from '@/image-response';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

export default function OGLoaderImage({
  title,
  pathImageAbsolute,
  loadingState: loadingStateExternal,
  onLoad,
  onFail,
  retryTime,
}: {
  title: string
  pathImageAbsolute: string
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
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

  const { width, height, aspectRatio } = IMAGE_OG_DIMENSION;

  return (
    <div
      className="relative"
      style={{ aspectRatio }}
    >
      {loadingState === 'loading' &&
        <div className={clsx(
          'absolute top-0 left-0 right-0 bottom-0 z-10',
          'flex items-center justify-center',
        )}>
          <Spinner size={40} />
        </div>}
      {loadingState === 'failed' &&
        <div className={clsx(
          'absolute top-0 left-0 right-0 bottom-0 z-11',
          'flex items-center justify-center',
          'text-red-400',
        )}>
          <BiError size={32} />
        </div>}
      {(loadingState === 'loading' || loadingState === 'loaded') &&
        <img
          alt={title}
          className={clsx(
            'absolute top-0 left-0 right-0 bottom-0 z-0',
            'w-full',
            loadingState === 'loading' && 'opacity-0',
            'transition-opacity',
          )}
          src={pathImageAbsolute}
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
  );
};
