import useMediaQuery from './useMediaQuery';

const MEDIA_QUERY_SELECTOR = '(prefers-reduced-motion: reduce)';

export default function usePrefersReducedMotion() {
  return useMediaQuery(MEDIA_QUERY_SELECTOR);
}
