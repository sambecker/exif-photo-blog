'use client';

/* eslint-disable jsx-a11y/alt-text */
import { BLUR_ENABLED } from '@/app/config';
import { useAppState } from '@/app/AppState';
import { clsx}  from 'clsx/lite';
import Image, { ImageProps } from 'next/image';
import {
  RefObject,
  SyntheticEvent,
  TransitionEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type Props = ImageProps & {
  ref?: RefObject<HTMLImageElement | null>
  blurCompatibilityLevel?: 'none' | 'low' | 'high'
  classNameImage?: string
  priority?: boolean
};

// Images ready within this window of mounting appear without fading
const FADE_THRESHOLD_MS = 100;

// Animation frames are paused while the document is hidden
const nextPaint = () => new Promise<void>(resolve =>
  requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

const confirmPaint = async (image: HTMLImageElement) => {
  await nextPaint();
  await image.decode().catch(() => {});
  await nextPaint();
  return image.isConnected && image.complete && image.naturalWidth > 0;
};

// Remount when src changes so load state never carries over
export default function ImageWithFallback(props: Props) {
  return (
    <ImageWithFallbackForSrc
      key={typeof props.src === 'string' ? props.src : undefined}
      {...props}
    />
  );
}

function ImageWithFallbackForSrc({
  ref: refProp,
  className,
  classNameImage = 'object-cover h-full',
  blurDataURL,
  blurCompatibilityLevel = 'low',
  priority,
  ...props
}: Props) {
  const ref = useRef<HTMLImageElement>(null);

  const { hasLoadedWithAnimations, shouldDebugImageFallbacks } = useAppState();

  // Fallback sits beneath the image, which is only revealed once decoded,
  // and is only removed once the fully opaque image has painted
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPainted, setIsPainted] = useState(false);
  const [shouldFade, setShouldFade] = useState(false);
  const [didError, setDidError] = useState(false);

  // Always fade on first app load, after server-rendered fallbacks
  const [isFirstAppLoad] = useState(!hasLoadedWithAnimations);
  const mountedAt = useRef(0);
  const isOpaque = useRef(false);

  const setRefs = useCallback((image: HTMLImageElement | null) => {
    ref.current = image;
    if (refProp) { refProp.current = image; }
  }, [refProp]);

  const removeFallbackOncePainted = useCallback((image: HTMLImageElement) => {
    confirmPaint(image).then(didPaint => {
      if (didPaint) { setIsPainted(true); }
    });
  }, []);

  // Reveal cached images before first paint to avoid flashing fallbacks
  useLayoutEffect(() => {
    mountedAt.current = performance.now();
    const image = ref.current;
    if (!isFirstAppLoad && image?.complete && image.naturalWidth > 0) {
      setIsRevealed(true);
      isOpaque.current = true;
      removeFallbackOncePainted(image);
    }
  }, [isFirstAppLoad, removeFallbackOncePainted]);

  // Restore fallback while hidden in case decoded images are discarded
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setIsPainted(false);
      } else if (isOpaque.current && ref.current) {
        removeFallbackOncePainted(ref.current);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [removeFallbackOncePainted]);

  const onLoad = useCallback(async (
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    const image = event.currentTarget;
    if (isOpaque.current) { return; }
    const isQuick =
      !isFirstAppLoad &&
      !document.hidden &&
      performance.now() - mountedAt.current < FADE_THRESHOLD_MS;
    if (!await confirmPaint(image)) { return; }
    if (isQuick) {
      setIsRevealed(true);
      isOpaque.current = true;
      await nextPaint();
      setIsPainted(true);
    } else {
      // Fallback removed once fade completes
      setShouldFade(true);
      setIsRevealed(true);
    }
  }, [isFirstAppLoad]);

  const onTransitionEnd = useCallback((
    event: TransitionEvent<HTMLImageElement>,
  ) => {
    if (
      event.propertyName === 'opacity' &&
      event.target === event.currentTarget &&
      isRevealed
    ) {
      isOpaque.current = true;
      removeFallbackOncePainted(event.currentTarget);
    }
  }, [isRevealed, removeFallbackOncePainted]);

  const onError = useCallback(() => setDidError(true), []);

  const getBlurClass = () => {
    switch (blurCompatibilityLevel) {
      case 'high':
      // Fix poorly blurred placeholder data generated on client
        return 'blur-[4px] @xs:blue-md scale-[1.05]';
      case 'low':
        return 'blur-[2px] @xs:blue-md scale-[1.01]';
    }
  };

  const showImage = isRevealed && !didError && !shouldDebugImageFallbacks;
  const showFallback = !isPainted || didError || shouldDebugImageFallbacks;

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
          // Fade clears any edges the image doesn't cover
          shouldFade && 'transition-opacity duration-300 ease-in',
          !(BLUR_ENABLED && blurDataURL) && 'bg-main',
          showFallback ? 'opacity-100' : 'opacity-0',
        )}
      >
        {(BLUR_ENABLED && blurDataURL)
          ? <img
            src={blurDataURL}
            alt=""
            aria-hidden
            width={props.width}
            height={props.height}
            style={props.style}
            loading="eager"
            decoding="sync"
            className={clsx(
              getBlurClass(),
              classNameImage,
            )}
          />
          :  <div className={clsx(
            'w-full h-full',
            'bg-gray-100/50 dark:bg-gray-900/50',
          )} />}
      </div>
      <Image ref={setRefs} {...{
        ...props,
        priority,
        className: clsx(
          classNameImage,
          'relative',
          shouldFade && 'transition-opacity duration-300 ease-in',
          showImage ? 'opacity-100' : 'opacity-0',
        ),
        onLoad,
        onError,
        onTransitionEnd,
      }} />
    </div>
  );
}
