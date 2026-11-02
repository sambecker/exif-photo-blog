'use client';

/* eslint-disable jsx-a11y/alt-text */
import { BLUR_ENABLED } from '@/app/config';
import { useAppState } from '@/app/AppState';
import { clsx }  from 'clsx/lite';
import Image, { ImageProps } from 'next/image';
import {
  ComponentProps,
  RefObject,
  SyntheticEvent,
  TransitionEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
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

// Reveal undecoded images rather than waiting on stalled decodes
const DECODE_TIMEOUT_MS = 500;

// Opaque equivalents of gray-100/50 and gray-900/50 over bg-main
const PLACEHOLDER_COLOR_LIGHT = '#f9fafb';
const PLACEHOLDER_COLOR_DARK = '#080c14';

// Animation frames are paused while the document is hidden
const nextPaint = () => new Promise<void>(resolve =>
  requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

const decode = (image: HTMLImageElement, timeoutMs?: number) => {
  const decoding = image.decode().catch(() => {});
  return timeoutMs === undefined
    ? decoding
    : Promise.race([
      decoding,
      new Promise<void>(resolve => setTimeout(resolve, timeoutMs)),
    ]);
};

const confirmPaint = async (image: HTMLImageElement) => {
  await nextPaint();
  await decode(image);
  await nextPaint();
  return image.isConnected && image.complete && image.naturalWidth > 0;
};

// Placeholders share the photo's exact aspect ratio so object-fit
// (cover or contain) positions them identically beneath the photo
const placeholderSrc = (width: number, height: number, content: string) =>
  'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" ' +
    `width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">` +
    content +
    '</svg>',
  );

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

  const hasBlur = BLUR_ENABLED && Boolean(blurDataURL);
  const width = Number(props.width);
  const height = Number(props.height);
  const hasDimensions = width > 0 && height > 0;

  // Fallbacks matching the photo's footprint stay beneath it indefinitely,
  // showing through whenever the photo isn't painted (e.g., when browsers
  // discard decoded images), while blurs bleeding past the photo's edges
  // (compatibility levels 'low' and 'high') are removed once painted
  const isFallbackPersistent =
    hasDimensions && (!hasBlur || blurCompatibilityLevel === 'none');

  // Fallback sits beneath the image, which is revealed once decoded
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
    if (isFallbackPersistent) { return; }
    confirmPaint(image).then(didPaint => {
      if (didPaint) { setIsPainted(true); }
    });
  }, [isFallbackPersistent]);

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

  // Restore removable fallbacks while hidden
  // in case decoded images are discarded
  useEffect(() => {
    if (isFallbackPersistent) { return; }
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
  }, [isFallbackPersistent, removeFallbackOncePainted]);

  const onLoad = useCallback(async (
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    const image = event.currentTarget;
    if (isOpaque.current) { return; }
    const isQuick =
      !isFirstAppLoad &&
      !document.hidden &&
      performance.now() - mountedAt.current < FADE_THRESHOLD_MS;
    // Revealing is always safe since the fallback remains beneath
    // until removal is separately confirmed
    await nextPaint();
    await decode(image, DECODE_TIMEOUT_MS);
    await nextPaint();
    if (!image.isConnected || isOpaque.current) { return; }
    if (isQuick) {
      setIsRevealed(true);
      isOpaque.current = true;
      removeFallbackOncePainted(image);
    } else {
      setShouldFade(true);
      setIsRevealed(true);
    }
  }, [isFirstAppLoad, removeFallbackOncePainted]);

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

  const placeholderSources = useMemo(() => hasDimensions
    ? {
      blur: hasBlur
        ? placeholderSrc(width, height,
          `<image href="${blurDataURL}" width="100%" height="100%" ` +
          'preserveAspectRatio="none"/>')
        : undefined,
      light: placeholderSrc(width, height,
        `<rect width="100%" height="100%" fill="${PLACEHOLDER_COLOR_LIGHT}"/>`),
      dark: placeholderSrc(width, height,
        `<rect width="100%" height="100%" fill="${PLACEHOLDER_COLOR_DARK}"/>`),
    }
    : undefined
  , [hasDimensions, hasBlur, width, height, blurDataURL]);

  const placeholderProps: ComponentProps<'img'> = {
    alt: '',
    'aria-hidden': true,
    width: props.width,
    height: props.height,
    style: props.style,
    loading: 'eager',
    decoding: 'sync',
  };

  const renderPlaceholder = () => {
    if (placeholderSources) {
      return placeholderSources.blur
        ? <img {...placeholderProps}
          src={placeholderSources.blur}
          className={clsx(getBlurClass(), classNameImage)}
        />
        : <>
          <img {...placeholderProps}
            src={placeholderSources.light}
            className={clsx(classNameImage, 'dark:hidden')}
          />
          <img {...placeholderProps}
            src={placeholderSources.dark}
            className={clsx(classNameImage, 'hidden dark:block')}
          />
        </>;
    } else {
      return hasBlur
        ? <img {...placeholderProps}
          src={blurDataURL}
          className={clsx(getBlurClass(), classNameImage)}
        />
        : <div className={clsx(
          'w-full h-full',
          'bg-gray-100/50 dark:bg-gray-900/50',
        )} />;
    }
  };

  const showImage = isRevealed && !didError && !shouldDebugImageFallbacks;
  const showFallback =
    isFallbackPersistent ||
    !isPainted ||
    didError ||
    shouldDebugImageFallbacks;

  return (
    <div
      className={clsx(
        'flex relative',
        className,
      )}
    >
      {/* Mirrors the wrapper's flex layout so placeholders
          size and position exactly like the photo */}
      <div
        className={clsx(
          '@container',
          'flex absolute inset-0 pointer-events-none',
          'overflow-hidden',
          // Fade clears any edges the image doesn't cover
          shouldFade && !isFallbackPersistent &&
            'transition-opacity duration-300 ease-in',
          !placeholderSources && !hasBlur && 'bg-main',
          showFallback ? 'opacity-100' : 'opacity-0',
        )}
      >
        {renderPlaceholder()}
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
