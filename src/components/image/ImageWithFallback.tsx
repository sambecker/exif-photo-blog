'use client';

/* eslint-disable jsx-a11y/alt-text */
import { BLUR_ENABLED } from '@/app/config';
import { useAppState } from '@/app/AppState';
import { clsx}  from 'clsx/lite';
import Image, { ImageProps } from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ImageWithFallback({
  className,
  classNameImage = 'object-cover h-full',
  forceFallbackFade = false,
  blurDataURL,
  blurCompatibilityLevel = 'low',
  priority,
  ...props
}: ImageProps & {
  blurCompatibilityLevel?: 'none' | 'low' | 'high'
  classNameImage?: string
  forceFallbackFade?: boolean
}) {
  const { shouldDebugImageFallbacks } = useAppState();

  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);
  const [fadeFallbackTransition, setFadeFallbackTransition] =
    useState(forceFallbackFade);

  const onLoad = useCallback(() => setIsLoading(false), []);
  const onError = useCallback(() => setDidError(true), []);

  const isLoadingRef = useRef(isLoading);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      // If image is still loading after 200ms, force CSS animation
      if (isLoadingRef.current) {
        setFadeFallbackTransition(true);
      }
    }, 200);
    return () => clearTimeout(timeout);
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

  return (
    <div
      className={clsx(
        'flex relative',
        className,
      )}
    >
      <Image {...{
        ...props,
        priority,
        className: classNameImage,
        onLoad,
        onError,
      }} />
      <div
        className={clsx(
          '@container',
          'absolute inset-0 pointer-events-none',
          'overflow-hidden',
          fadeFallbackTransition &&
            'transition-opacity duration-300 ease-in',
          !(BLUR_ENABLED && blurDataURL) && 'bg-main',
          (isLoading || didError || shouldDebugImageFallbacks)
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
