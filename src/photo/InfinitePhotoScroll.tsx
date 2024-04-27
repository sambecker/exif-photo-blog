'use client';

import useSwrInfinite from 'swr/infinite';
import PhotosLarge from '@/photo/PhotosLarge';
import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
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
}: {
  type?: 'full-frame' | 'grid'
  initialOffset?: number
  itemsPerPage?: number
  debug?: boolean
}) {
  const { swrTimestamp, isUserSignedIn } = useAppState();

  const key = `${swrTimestamp}-${type}`;

  const keyGenerator = useCallback(
    (size: number, prev: Photo[]) => prev && prev.length === 0
      ? null
      : [key, size]
    , [key]);

  const fetcher = useCallback(([_key, size]: [string, number]) => {
    console.log('Fetching', size);
    return getPhotosAction(
      initialOffset + size * itemsPerPage,
      itemsPerPage,
    );
  }, [initialOffset, itemsPerPage]);

  const { data, isLoading, isValidating, error, mutate, setSize } =
    useSwrInfinite<Photo[]>(
      keyGenerator,
      fetcher,
      {
        initialSize: 2,
        revalidateFirstPage: false,
        revalidateOnFocus: Boolean(isUserSignedIn),
        revalidateOnReconnect: Boolean(isUserSignedIn),
      },
    );

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  
  const isLoadingOrValidating = isLoading || isValidating;

  const isFinished = useMemo(() =>
    data && data[data.length - 1]?.length < itemsPerPage
  , [data, itemsPerPage]);

  const advance = useCallback(() => {
    if (!isFinished && !isLoadingOrValidating) {
      setSize(size => size + 1);
    }
  }, [isFinished, isLoadingOrValidating, setSize]);

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
    <div ref={buttonContainerRef}>
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
        ? <PhotosLarge {...{
          photos,
          revalidatePhoto,
          onLastPhotoVisible: advance,
        }} />
        : <PhotoGrid {...{
          photos,
          onLastPhotoVisible: advance,
        }} />}
      {!isFinished && (type === 'full-frame'
        ? <SiteGrid contentMain={renderMoreButton()} />
        : renderMoreButton())}
    </div>
  );
}
