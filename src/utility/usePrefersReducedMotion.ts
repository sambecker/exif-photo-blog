import { useEffect, useState } from 'react';

const MEDIA_QUERY_SELECTOR = '(prefers-reduced-motion: reduce)';
const MEDIA_QUERY_EVENT = 'change';

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia(MEDIA_QUERY_SELECTOR).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY_SELECTOR);

    const listener = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener(MEDIA_QUERY_EVENT, listener);
    return () => mediaQuery.removeEventListener(MEDIA_QUERY_EVENT, listener);
  }, []);

  return prefersReducedMotion;
};

export default usePrefersReducedMotion;
