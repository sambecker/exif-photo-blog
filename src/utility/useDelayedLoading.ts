'use client';

import { useEffect, useRef } from 'react';

export const DEFAULT_FLICKER_THRESHOLD = 400;

export default function useDelayedLoading(
  pending: boolean,
  setIsLoading: (isLoading: boolean) => void,
  flickerThreshold = DEFAULT_FLICKER_THRESHOLD,
) {
  const startLoadingTimeout = useRef<NodeJS.Timeout>(undefined);
  const stopLoadingTimeout = useRef<NodeJS.Timeout>(undefined);
  const isLoadingStartTime = useRef<number>(undefined);
  const isShowingLoader = useRef(false);

  useEffect(() => {
    if (pending) {
      clearTimeout(stopLoadingTimeout.current);
      stopLoadingTimeout.current = undefined;
      if (!startLoadingTimeout.current && !isShowingLoader.current) {
        startLoadingTimeout.current = setTimeout(() => {
          isShowingLoader.current = true;
          isLoadingStartTime.current = Date.now();
          setIsLoading(true);
        }, flickerThreshold);
      }
      return;
    }

    clearTimeout(startLoadingTimeout.current);
    startLoadingTimeout.current = undefined;

    if (!isShowingLoader.current) {
      setIsLoading(false);
      return;
    }

    const loadingDuration = Date.now() - (isLoadingStartTime.current ?? 0);
    clearTimeout(stopLoadingTimeout.current);
    stopLoadingTimeout.current = setTimeout(() => {
      isShowingLoader.current = false;
      isLoadingStartTime.current = undefined;
      setIsLoading(false);
    }, Math.max(0, flickerThreshold - loadingDuration));
  }, [pending, setIsLoading, flickerThreshold]);

  useEffect(() => {
    return () => {
      clearTimeout(startLoadingTimeout.current);
      clearTimeout(stopLoadingTimeout.current);
    };
  }, []);
}
