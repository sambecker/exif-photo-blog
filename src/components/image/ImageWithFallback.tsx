'use client';

/* eslint-disable jsx-a11y/alt-text */
import { BLUR_ENABLED } from '@/app/config';
import { useAppState } from '@/state/AppState';
import { clsx}  from 'clsx/lite';
import Image, { ImageProps } from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ImageWithFallback({
  className,
  classNameImage = 'object-cover h-full',
  priority,
  blurDataURL,
  blurCompatibilityLevel = 'low',
  ...props
}: ImageProps & {
  blurCompatibilityLevel?: 'none' | 'low' | 'high'
  classNameImage?: string
}) {
  const { shouldDebugImageFallbacks } = useAppState();

  const [wasCached, setWasCached] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);

  const onLoad = useCallback(() => setIsLoading(false), []);
  const onError = useCallback(() => setDidError(true), []);

  const [hideFallback, setHideFallback] = useState(false);

  const refImage = useRef<HTMLImageElement>(null);
  const refFallback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWasCached(
      Boolean(refImage.current?.complete) &&
      (refImage.current?.naturalWidth ?? 0) > 0,
    );
  }, []);

  useEffect(() => {
    if (!isLoading && !didError) {
      let innerTimeout: NodeJS.Timeout;
      const timeout = setTimeout(() => {
        if (refFallback.current) {
          const fallbackOpacity = (refFallback
            .current
            .computedStyleMap()
            .get('opacity') as CSSUnitValue
          )?.value;
          // Address race condition where cached image is initially loaded
          // and fallback is still being shown at full opacity
          if (fallbackOpacity === 0) {
            // Image has loaded and fallback is already hidden
            setHideFallback(true);
          } else {
            // Image has loaded but fallback is still visible
            // Delay hiding fallback to avoid abrupt transition
            innerTimeout = setTimeout(() =>{
              console.log('Delayed hide fallback');
              setHideFallback(true);
            }, 1000);
          }
        }
      }, 1000);
      return () => {
        clearTimeout(timeout);
        clearTimeout(innerTimeout);
      };
    }
  }, [isLoading, didError]);

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
        'flex relative',
        className,
      )}
    >
      <Image {...{
        ...props,
        ref: refImage,
        priority,
        className: classNameImage,
        onLoad,
        onError,
      }} />
      <div
        ref={refFallback}
        className={clsx(
          '@container',
          'absolute inset-0 pointer-events-none',
          'overflow-hidden',
          (showFallback || shouldDebugImageFallbacks) &&
            'transition-opacity duration-300 ease-in',
          !(BLUR_ENABLED && blurDataURL) && 'bg-main',
          (isLoading || shouldDebugImageFallbacks)
            ? 'opacity-100'
            : 'opacity-0',
        )}
      >
        {(BLUR_ENABLED && blurDataURL)
          ? <img {...{
            ...props,
            src: blurDataURL,
            className: clsx(
              getBlurClass(),
              classNameImage,
            ),
          }} />
          :  <div className={clsx(
            'w-full h-full',
            'bg-gray-100/50 dark:bg-gray-900/50',
          )} />}
      </div>
    </div>
  );
}
