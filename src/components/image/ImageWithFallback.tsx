'use client';

/* eslint-disable jsx-a11y/alt-text */
import { BLUR_ENABLED } from '@/site/config';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import Image, { ImageProps } from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import FullscreenButton from '../FullscreenButton';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

export default function ImageWithFallback(props: ImageProps & {
  blurCompatibilityLevel?: 'none' | 'low' | 'high'
  imgClassName?: string
  allowFullscreen?: boolean
  enableImageActions?: boolean
}) {
  const {
    className,
    priority,
    blurDataURL,
    blurCompatibilityLevel = 'low',
    imgClassName = 'object-cover h-full',
    enableImageActions = false,
    ...rest
  } = props;

  const { shouldDebugImageFallbacks } = useAppState();

  const [wasCached, setWasCached] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);

  const onLoad = useCallback(() => setIsLoading(false), []);
  const onError = useCallback(() => setDidError(true), []);

  const [hideFallback, setHideFallback] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { isFullscreen } = useAppState();

  useEffect(() => {
    const timeout = setTimeout(
      () => setWasCached(imgRef.current?.complete ?? false),
      100,
    );
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isLoading && !didError) {
      const timeout = setTimeout(() => {
        setHideFallback(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, didError]);

  useEffect(() => {
    if (containerRef.current && enableImageActions) {
      viewerRef.current = new Viewer(containerRef.current, {
        inline: false,
        button: true,
        navbar: false,
        title: false,
        toolbar: {
          zoomIn: 1,
          zoomOut: 1,
          oneToOne: 1,
          reset: 1,
          prev: 0,
          play: {
            show: 0,
            size: 'large',
          },
          next: 0,
          rotateLeft: 1,
          rotateRight: 1,
          flipHorizontal: 1,
          flipVertical: 1,
          tooltip: 1,
        },
      });
      return () => {
        viewerRef.current?.destroy();
      };
    }
  }, [enableImageActions]);

  const showFallback =
    !wasCached &&
    !hideFallback;

  const getBlurClass = () => {
    switch (blurCompatibilityLevel) {
    case 'high':
      // Fix poorly blurred placeholder data generated on client
      return 'blur-[4px] @xs:blue-md scale-[1.05]';
    case 'low':
      return 'blur-[2px] @xs:blue-md scale-[1.01]';
    }
  };

  return (
    <div
      className={clsx(
        className,
        'flex relative',
      )}
      ref={containerRef}
    >
      {(showFallback || shouldDebugImageFallbacks) &&
        <div className={clsx(
          '@container',
          'absolute inset-0',
          'overflow-hidden',
          'transition-opacity duration-300 ease-in',
          !(BLUR_ENABLED && blurDataURL) && 'bg-main',
          (isLoading || shouldDebugImageFallbacks)
            ? 'opacity-100'
            : 'opacity-0',
        )}>
          {(BLUR_ENABLED && blurDataURL)
            ? <img {...{
              ...rest,
              src: blurDataURL,
              className: clsx(
                imgClassName,
                getBlurClass(),
              ),
            }} />
            :  <div className={clsx(
              'w-full h-full',
              'bg-gray-100/50 dark:bg-gray-900/50',
            )} />}
        </div>}
      <Image
        {...rest}
        ref={imgRef}
        priority={priority}
        className={clsx(
          imgClassName,
          !isFullscreen && enableImageActions && 'cursor-zoom-in',
        )}
        onLoad={onLoad}
        onError={onError}
      />
      {enableImageActions && <FullscreenButton imageRef={imgRef} />}
    </div>
  );
}
