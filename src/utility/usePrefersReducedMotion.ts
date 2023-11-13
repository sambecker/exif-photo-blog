import { useEffect, useState } from 'react';

const MEDIA_QUERY_SELECTOR = '(prefers-reduced-motion: reduce)';
const MEDIA_QUERY_EVENT = 'change';

const safelyGetMediaQuery = () => typeof window !== 'undefined'
  ? window.matchMedia(MEDIA_QUERY_SELECTOR)
  : undefined;

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    safelyGetMediaQuery()?.matches ?? false
  );

  useEffect(() => {
    const mediaQuery = safelyGetMediaQuery();

    const listener = () => {
      setPrefersReducedMotion(mediaQuery?.matches ?? false);
    };

    mediaQuery?.addEventListener(MEDIA_QUERY_EVENT, listener);
    return () => mediaQuery?.removeEventListener(MEDIA_QUERY_EVENT, listener);
  }, []);

  return prefersReducedMotion;
};

export default usePrefersReducedMotion;
