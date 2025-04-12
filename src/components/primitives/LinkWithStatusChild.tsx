'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useLinkStatus } from 'next/link';

const FLICKER_THRESHOLD = 400;

export default function LinkWithStatusChild({
  children,
  isLoading,
  setIsLoading,
}: {
  children: ReactNode
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}) {
  const { pending } = useLinkStatus();

  const startLoadingTimeout = useRef<NodeJS.Timeout>(undefined);
  const stopLoadingTimeout = useRef<NodeJS.Timeout>(undefined);
  
  const isLoadingStartTime = useRef<number>(undefined);
  useEffect(() => {
    if (isLoading) {
      isLoadingStartTime.current = Date.now();
    } else {
      isLoadingStartTime.current = undefined;
    }
  }, [isLoading]);

  useEffect(() => {
    if (pending) {
      clearTimeout(stopLoadingTimeout.current);
      startLoadingTimeout.current = setTimeout(() => {
        setIsLoading(true);
      }, FLICKER_THRESHOLD);
    } else if (isLoadingStartTime.current) {
      clearTimeout(startLoadingTimeout.current);
      const loadingDuration = Date.now() - isLoadingStartTime.current;
      stopLoadingTimeout.current = setTimeout(() => {
        setIsLoading(false);
      }, FLICKER_THRESHOLD - loadingDuration);
    }
  }, [pending, setIsLoading]);

  useEffect(() => () => {
    clearTimeout(startLoadingTimeout.current);
    clearTimeout(stopLoadingTimeout.current);
  }, []);

  return <>{children}</>;
}
