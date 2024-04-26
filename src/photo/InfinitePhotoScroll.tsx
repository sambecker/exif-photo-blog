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
  const key = type;

  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const fetcher = useCallback(([_key, size]: [string, number]) =>
    getPhotosAction(
      initialOffset + size * itemsPerPage,
      itemsPerPage,
    )
  , [initialOffset, itemsPerPage]);

  const { data, isLoading, isValidating, error, mutate, size, setSize } =
    useSwrInfinite<Photo[]>(
      (size: number, prev: []) => prev && prev.length === 0
        ? null
        : [key, size],
      fetcher,
      { revalidateFirstPage: false },
    );

  const isFinished = useMemo(() =>
    data && data[data.length - 1]?.length < itemsPerPage
  , [data, itemsPerPage]);

  useEffect(() => {
    if (prefetch && !isFinished) {
      preload([key, (size ?? 0) + 1], fetcher);
    }
  }, [prefetch, isFinished, key, size, fetcher]);

  const advance = useCallback(() => {
    if (!isFinished) {
      setSize(size => size + 1);
    }
  }, [isFinished, setSize]);

  useEffect(() => {
    // Only add observer if button is rendered
    if (buttonContainerRef.current) {
      const observer = new IntersectionObserver(e => {
        if (triggerOnView && e[0].isIntersecting) {
          advance();
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
        onClick={error ? () => mutate() : advance}
        disabled={isLoading || isValidating}
        className={clsx(
          'w-full flex justify-center',
          isLoading || isValidating && 'subtle',
        )}
      >
        {error
          ? 'Try Again'
          : isLoading || isValidating
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
