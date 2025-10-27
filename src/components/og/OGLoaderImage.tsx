'use client';

import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx/lite';
import Spinner from '@/components/Spinner';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import { TbPhotoQuestion } from 'react-icons/tb';

type LoadingState = 'loading' | 'loaded' | 'failed';

export default function OGLoaderImage({
  title,
  path,
  retryTime,
  className,
  enabled = true,
}: {
  title: string
  path: string
  retryTime?: number  
  className?: string
  enabled?: boolean
}) {
  const ref = useRef<HTMLImageElement>(null);

  const [loadingState, setLoadingState] = useState<LoadingState>('loading');

  const { width, height, aspectRatio } = IMAGE_OG_DIMENSION;

  useEffect(() => {
    if (!ref.current?.complete) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingState('loading');
    }
  }, [path]);

  return (
    <div
      key={path}
      className={clsx(
        'relative',
        className,
      )}
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
          'text-dim',
        )}>
          <TbPhotoQuestion size={28} />
        </div>}
      {(loadingState === 'loading' || loadingState === 'loaded') &&
        <img
          ref={ref}
          alt={title}
          className={clsx(
            'absolute top-0 left-0 right-0 bottom-0 z-0',
            'w-full',
            loadingState === 'loading' && 'opacity-0',
            'transition-opacity',
          )}
          src={enabled ? path : ''}
          width={width}
          height={height}
          onLoadStart={() => setLoadingState('loading')}
          onLoad={() => setLoadingState('loaded')}
          onError={e => {
            setLoadingState('failed');
            if (retryTime !== undefined) {
              setLoadingState('loading');
              setTimeout(() => {
                e.currentTarget.src = '';
                e.currentTarget.src = path;
              }, retryTime);
            }
          }}
        />}
    </div>
  );
};
