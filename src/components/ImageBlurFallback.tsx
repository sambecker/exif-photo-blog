'use client';

/* eslint-disable jsx-a11y/alt-text */
import { BLUR_ENABLED } from '@/site/config';
import { useAppState } from '@/state/AppState';
import { clsx}  from 'clsx/lite';
import Image, { ImageProps } from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ImageBlurFallback(props: ImageProps & {
  blurCompatibilityLevel?: 'none' | 'low' | 'high';
}) {
  const {
    className,
    priority,
    blurDataURL,
    blurCompatibilityLevel = 'low',
    ...rest
  } = props;

  const { shouldDebugBlur } = useAppState();

  const [wasCached, setWasCached] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);

  const onLoad = useCallback(() => setIsLoading(false), []);
  const onError = useCallback(() => setDidError(true), []);

  const [hideBlurPlaceholder, setHideBlurPlaceholder] = useState(false);

  const imageClassName = 'object-cover h-full';

  const imgRef = useRef<HTMLImageElement>(null);

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
        setHideBlurPlaceholder(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, didError]);

  const showPlaceholder =
    !wasCached &&
    !hideBlurPlaceholder;

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
    >
      {(showPlaceholder || shouldDebugBlur) &&
        <div className={clsx(
          '@container',
          'absolute inset-0',
          'bg-main overflow-hidden',
          'transition-opacity duration-300 ease-in',
          (isLoading || shouldDebugBlur) ? 'opacity-100' : 'opacity-0',
        )}>
          {(BLUR_ENABLED && props.blurDataURL)
            ? <img {...{
              ...rest,
              src: blurDataURL,
              className: clsx(
                imageClassName,
                getBlurClass(),
              ),
            }} />
            :  <div className={clsx(
              'w-full h-full',
              'bg-gray-100/50 dark:bg-gray-900/50',
            )} />}
        </div>}
      <Image {...{
        ...rest,
        ref: imgRef,
        priority,
        className: imageClassName,
        onLoad,
        onError,
      }} />
    </div>
  );
}
