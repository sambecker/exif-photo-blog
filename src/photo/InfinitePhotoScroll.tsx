'use client';

import { preload } from 'swr';
import useSwrInfinite from 'swr/infinite';
import PhotosLarge from '@/photo/PhotosLarge';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import { getPhotosAction } from '@/photo/actions';
import { Photo } from '.';
import PhotoGrid from './PhotoGrid';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/state/AppState';

export type RevalidatePhoto = (
  photoId: string,
  revalidateRemainingPhotos?: boolean,
) => Promise<any>;

export default function InfinitePhotoScroll({
  type = 'full-frame',
  initialOffset = 0,
  itemsPerPage = 12,
  prefetch = true,
  triggerOnView = true,
}: {
  type?: 'full-frame' | 'grid'
  initialOffset?: number
  itemsPerPage?: number
  prefetch?: boolean
  triggerOnView?: boolean
  debug?: boolean
}) {
  const { swrTimestamp, isUserSignedIn } = useAppState();

  const key = `${swrTimestamp}-${type}`;

  const keyGenerator = useCallback(
    (size: number, prev: Photo[]) => prev && prev.length === 0
      ? null
      : [key, size]
    , [key]);

  const fetcher = useCallback(([_key, size]: [string, number]) =>
    getPhotosAction(
      initialOffset + size * itemsPerPage,
      itemsPerPage,
    )
  , [initialOffset, itemsPerPage]);

  const { data, isLoading, isValidating, error, mutate, size, setSize } =
    useSwrInfinite<Photo[]>(
      keyGenerator,
      fetcher,
      {
        revalidateFirstPage: Boolean(isUserSignedIn),
        revalidateOnMount: Boolean(isUserSignedIn),
        revalidateOnFocus: Boolean(isUserSignedIn),
        revalidateOnReconnect: Boolean(isUserSignedIn),
      },
    );

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  
  const isLoadingOrValidating = isLoading || isValidating;

  const isFinished = useMemo(() =>
    data && data[data.length - 1]?.length < itemsPerPage
  , [data, itemsPerPage]);

  useEffect(() => {
    if (prefetch && !isFinished) {
      preload([key, (size ?? 0) + 1], fetcher);
    }
  }, [prefetch, isFinished, key, size, fetcher]);

  const advance = useCallback((advanceWhileStillVisible?: boolean) => {
    if (!isFinished && !isLoadingOrValidating) {
      setSize(size => size + 1);
      if (advanceWhileStillVisible) {
        setTimeout(() => {
          const rect = buttonContainerRef.current?.getBoundingClientRect();
          if (rect && rect.top >= 0) {
            advance(true);
          }
        }, 1000);
      }
    }
  }, [isFinished, setSize, isLoadingOrValidating]);

  useEffect(() => {
    // Only add observer if button is rendered
    if (buttonContainerRef.current) {
      const observer = new IntersectionObserver(e => {
        if (triggerOnView && e[0].isIntersecting) {
          advance(true);
        }
      }, {
        root: null,
        threshold: 0,
      });
      observer.observe(buttonContainerRef.current);
      return () => observer.disconnect();
    }
  }, [triggerOnView, advance]);

  const photos = useMemo(() => (data ?? [])?.flat(), [data]);

  const revalidatePhoto: RevalidatePhoto = useCallback((
    photoId: string,
    revalidateRemainingPhotos?: boolean,
  ) => mutate(data, {
    revalidate: (_data: Photo[], [_, size]:[string, number]) => {
      const i = (data ?? []).findIndex(photos =>
        photos.some(photo => photo.id === photoId));
      return revalidateRemainingPhotos ? size >= i : size === i;
    },
  } as any), [data, mutate]);

  const renderMoreButton = () =>
    <div
      ref={buttonContainerRef}
      // Make button bounding visible earlier
      className="-translate-y-32 pt-32 -mb-32"
    >
      <button
        onClick={() => error ? mutate() : advance()}
        disabled={isLoading || isValidating}
        className={clsx(
          'w-full flex justify-center',
          isLoadingOrValidating && 'subtle',
        )}
      >
        {error
          ? 'Try Again'
          : isLoadingOrValidating
            ? <Spinner size={20} />
            : 'Load More'}
      </button>
    </div>;

  return (
    <div className="space-y-4">
      {type === 'full-frame'
        ? <PhotosLarge {...{ photos, revalidatePhoto }} />
        : <PhotoGrid {...{ photos }} />}
      {!isFinished && (type === 'full-frame'
        ? <SiteGrid contentMain={renderMoreButton()} />
        : renderMoreButton())}
    </div>
  );
}
