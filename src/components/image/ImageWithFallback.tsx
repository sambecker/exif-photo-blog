'use client';

/* eslint-disable jsx-a11y/alt-text */
import { BLUR_ENABLED } from '@/app/config';
import { useAppState } from '@/app/AppState';
import { clsx}  from 'clsx/lite';
import Image, { ImageProps } from 'next/image';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export default function ImageWithFallback({
  ref: refProp,
  className,
  classNameImage = 'object-cover h-full',
  blurDataURL,
  blurCompatibilityLevel = 'low',
  priority,
  ...props
}: ImageProps & {
  ref?: RefObject<HTMLImageElement | null>
  blurCompatibilityLevel?: 'none' | 'low' | 'high'
  classNameImage?: string
  priority?: boolean
}) {
  const ref = useRef<HTMLImageElement>(null);

  const { hasLoadedWithAnimations, shouldDebugImageFallbacks } = useAppState();

  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);
  const [fadeFallbackTransition, setFadeFallbackTransition] =
    useState(!hasLoadedWithAnimations);

  const onLoad = useCallback(() => setIsLoading(false), []);
  const onError = useCallback(() => setDidError(true), []);

  useEffect(() => {
    if (
      !ref.current?.complete ||
      (ref.current?.naturalWidth ?? 0) === 0
    ) {
      setFadeFallbackTransition(true);
    }
  }, []);

  const getBlurClass = () => {
    switch (blurCompatibilityLevel) {
      case 'high':
      // Fix poorly blurred placeholder data generated on client
        return 'blur-[4px] @xs:blue-md scale-[1.05]';
      case 'low':
        return 'blur-[2px] @xs:blue-md scale-[1.01]';
    }
  };

  const showFallback = isLoading || didError || shouldDebugImageFallbacks;

  // Fallback sits beneath the image so it remains visible
  // until the image actually paints, then fades out
  // (delayed) to clear any edges the image doesn't cover
  return (
    <div
      className={clsx(
        'flex relative',
        className,
      )}
    >
      <div
        className={clsx(
          '@container',
          'absolute inset-0 pointer-events-none',
          'overflow-hidden',
          fadeFallbackTransition &&
            'transition-opacity duration-300 ease-in',
          fadeFallbackTransition && !showFallback && 'delay-300',
          !(BLUR_ENABLED && blurDataURL) && 'bg-main',
          showFallback ? 'opacity-100' : 'opacity-0',
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
      <Image ref={refProp ?? ref} {...{
        ...props,
        priority,
        className: clsx(
          classNameImage,
          'relative',
          fadeFallbackTransition &&
            'transition-opacity duration-300 ease-in',
          showFallback && 'opacity-0',
        ),
        onLoad,
        onError,
      }} />
    </div>
  );
}
