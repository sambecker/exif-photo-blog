'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useLinkStatus } from 'next/link';

const FLICKER_THRESHOLD = 400;

export default function LinkWithStatusChild({
  children,
  setIsLoading,
}: {
  children: ReactNode
  setIsLoading: (isLoading: boolean) => void
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
      }, FLICKER_THRESHOLD);
    } else if (startLoadingTimeout.current) {
      clearTimeout(startLoadingTimeout.current);
      startLoadingTimeout.current = undefined;
      const loadingDuration = Date.now() - (isLoadingStartTime.current ?? 0);
      stopLoadingTimeout.current = setTimeout(() => {
        setIsLoading(false);
        isLoadingStartTime.current = undefined;
      }, FLICKER_THRESHOLD - loadingDuration);
    }
  }, [pending, setIsLoading]);

  useEffect(() => () => {
    clearTimeout(startLoadingTimeout.current);
    clearTimeout(stopLoadingTimeout.current);
  }, []);

  return <>{children}</>;
}
