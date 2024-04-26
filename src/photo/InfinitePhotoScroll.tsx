'use client';

import { preload } from 'swr';
import useSwrInfinite from 'swr/infinite';
import PhotosLarge from '@/photo/PhotosLarge';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import { getPhotosAction } from '@/photo/actions';
import { useAppState } from '@/state/AppState';

export default function InfinitePhotoScroll({
  key = 'PHOTOS',
  initialOffset = 0,
  itemsPerPage = 12,
  prefetch = true,
  triggerOnView = true,
  debug = true,
}: {
  key?: string
  initialOffset?: number
  itemsPerPage?: number
  prefetch?: boolean
  triggerOnView?: boolean
  debug?: boolean
}) {
  const { isUserSignedIn } = useAppState();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetcher = useCallback((key: string) => {
    if (debug) { console.log('Fetching', key); }
    const offset = parseInt(key.split('-')[1]);
    return getPhotosAction(
      initialOffset + offset * itemsPerPage,
      itemsPerPage,
      key,
    );
  }, [initialOffset, itemsPerPage, debug]);

  const { data, isLoading, error, mutate, size, setSize } = useSwrInfinite(
    (size: number, prev: []) => prev && prev.length === 0
      ? null
      :`${key}-${size}`,
    fetcher,
    {
      revalidateOnFocus: isUserSignedIn,
      revalidateOnReconnect: isUserSignedIn,
      revalidateFirstPage: isUserSignedIn,
    },
  );

  const isFinished = useMemo(() =>
    data && data[data.length - 1]?.length < itemsPerPage
  , [data, itemsPerPage]);

  useEffect(() => {
    if (prefetch) {
      preload(`${key}-${size ?? 0 + 1}`, fetcher);
    }
  }, [prefetch, key, size, fetcher]);

  const advance = useCallback(() => setSize(size => size + 1), [setSize]);

  useEffect(() => {
    // Only add observer if button is rendered
    if (buttonRef.current) {
      const observer = new IntersectionObserver(e => {
        if (triggerOnView && e[0].isIntersecting) {
          advance();
        }
      }, {
        root: null,
        threshold: 0,
      });
      observer.observe(buttonRef.current);
      return () => observer.disconnect();
    }
  }, [triggerOnView, advance]);

  return (
    <div className="space-y-4">
      {data && <div className="space-y-1">
        {data.map((photos, i) => <PhotosLarge key={i} photos={photos} />)}
      </div>}
      {!isFinished &&
        <SiteGrid
          contentMain={
            <button
              ref={buttonRef}
              onClick={error ? () => mutate() : advance}
              disabled={isLoading}
              className="w-full flex justify-center"
            >
              {error
                ? 'Try Again'
                : isLoading
                  ? <Spinner size={20} />
                  : 'Load More'}
            </button>
          } />}
    </div>
  );
}
