import { useCallback, useMemo, useSyncExternalStore } from 'react';

const MEDIA_QUERY_EVENT = 'change';

// Media queries can't be evaluated while rendering on the server, so the
// server snapshot reports `fallback` and React swaps in the real value as
// part of hydration—avoiding both a mismatch and a setState-in-effect pass
export default function useMediaQuery(
  query: string,
  fallback = false,
) {
  const mediaQuery = useMemo(() => typeof window !== 'undefined'
    ? window.matchMedia(query)
    : undefined
  , [query]);

  const subscribe = useCallback((onStoreChange: () => void) => {
    mediaQuery?.addEventListener(MEDIA_QUERY_EVENT, onStoreChange);
    return () =>
      mediaQuery?.removeEventListener(MEDIA_QUERY_EVENT, onStoreChange);
  }, [mediaQuery]);

  const getSnapshot = useCallback(() =>
    mediaQuery?.matches ?? fallback
  , [mediaQuery, fallback]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
