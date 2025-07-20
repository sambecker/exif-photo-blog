'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useLinkStatus } from 'next/link';

const DEFAULT_FLICKER_THRESHOLD = 400;

export default function LinkWithStatusChild({
  children,
  setIsLoading,
  onLoad,
  flickerThreshold = DEFAULT_FLICKER_THRESHOLD,
}: {
  children: ReactNode
  setIsLoading: (isLoading: boolean) => void
  onLoad?: () => void
  flickerThreshold?: number
}) {
  const { pending } = useLinkStatus();

  const startLoadingTimeout = useRef<NodeJS.Timeout>(undefined);
  const stopLoadingTimeout = useRef<NodeJS.Timeout>(undefined);
  
  const isLoadingStartTime = useRef<number>(undefined);

  useEffect(() => {
    if (pending) {
      clearTimeout(stopLoadingTimeout.current);
      stopLoadingTimeout.current = undefined;
      startLoadingTimeout.current = setTimeout(() => {
        setIsLoading(true);
        isLoadingStartTime.current = Date.now();
      }, flickerThreshold);
    } else if (startLoadingTimeout.current) {
      clearTimeout(startLoadingTimeout.current);
      startLoadingTimeout.current = undefined;
      const loadingDuration = Date.now() - (isLoadingStartTime.current ?? 0);
      stopLoadingTimeout.current = setTimeout(() => {
        setIsLoading(false);
        isLoadingStartTime.current = undefined;
      }, Math.max(0, flickerThreshold - loadingDuration));
    }
  }, [pending, setIsLoading, flickerThreshold]);

  useEffect(() => {
    return () => {
      clearTimeout(startLoadingTimeout.current);
      clearTimeout(stopLoadingTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!pending && startLoadingTimeout.current) {
      onLoad?.();
    }
    return () => {
      if (pending && startLoadingTimeout.current) {
        onLoad?.();
      }
    };
  }, [pending, onLoad]);

  return <>{children}</>;
}
