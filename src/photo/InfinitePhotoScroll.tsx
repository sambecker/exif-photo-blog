'use client';

import { preload } from 'swr';
import useSwrInfinite from 'swr/infinite';
import PhotosLarge from '@/photo/PhotosLarge';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import { getPhotosAction } from '@/photo/actions';
import { useAppState } from '@/state/AppState';
import { Photo } from '.';
import PhotoGrid from './PhotoGrid';

const KEY = 'PHOTOS';

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
  const { isUserSignedIn } = useAppState();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetcher = useCallback(([_key, size]: [string, number]) =>
    getPhotosAction(
      initialOffset + size * itemsPerPage,
      itemsPerPage,
    )
  , [initialOffset, itemsPerPage]);

  const { data, isLoading, error, mutate, size, setSize } =
    useSwrInfinite<Photo[]>(
      (size: number, prev: []) => prev && prev.length === 0
        ? null
        : [KEY, size],
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
      preload([KEY, size ?? 0 + 1], fetcher);
    }
  }, [prefetch, size, fetcher]);

  const advance = useCallback(() => setSize(size => size + 1), [setSize]);

  useEffect(() => {
    // Only add observer if button is rendered
    if (buttonRef.current) {
      const observer = new IntersectionObserver(e => {
        if (triggerOnView && e.some(e => e.isIntersecting)) {
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
    </button>;

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
