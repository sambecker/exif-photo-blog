'use client';

import useSwrInfinite from 'swr/infinite';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import AppGrid from '@/components/AppGrid';
import Spinner from '@/components/Spinner';
import { getPhotosCachedAction, getPhotosAction } from '@/photo/actions';
import { Photo } from '.';
import { PhotoSetCategory } from '../category';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/state/AppState';
import { GetPhotosOptions } from './db';
import useVisible from '@/utility/useVisible';
import { ADMIN_DB_OPTIMIZE_ENABLED } from '@/app/config';

export type RevalidatePhoto = (
  photoId: string,
  revalidateRemainingPhotos?: boolean,
) => Promise<any>;

export default function InfinitePhotoScroll({
  cacheKey,
  initialOffset,
  itemsPerPage,
  sortBy,
  tag,
  camera,
  lens,
  simulation,
  wrapMoreButtonInGrid,
  useCachedPhotos = true,
  includeHiddenPhotos,
  children,
}: {
  initialOffset: number
  itemsPerPage: number
  sortBy?: GetPhotosOptions['sortBy']
  cacheKey: string
  wrapMoreButtonInGrid?: boolean
  useCachedPhotos?: boolean
  includeHiddenPhotos?: boolean
  children: (props: {
    photos: Photo[]
    onLastPhotoVisible: () => void
    revalidatePhoto?: RevalidatePhoto
  }) => ReactNode
} & PhotoSetCategory) {
  const { swrTimestamp, isUserSignedIn } = useAppState();

  const key = `${swrTimestamp}-${cacheKey}`;

  const keyGenerator = useCallback(
    (size: number, prev: Photo[]) => prev && prev.length === 0
      ? null
      : [key, size]
    , [key]);

  const fetcher = useCallback((
    [_key, size]: [string, number],
    warmOnly?: boolean,
  ) =>
    (useCachedPhotos ? getPhotosCachedAction : getPhotosAction)({
      offset: initialOffset + size * itemsPerPage,
      sortBy,
      limit: itemsPerPage,
      hidden: includeHiddenPhotos ? 'include' : 'exclude',
      camera,
      lens,
      tag,
      simulation,
    }, warmOnly)
  , [
    useCachedPhotos,
    sortBy,
    initialOffset,
    itemsPerPage,
    includeHiddenPhotos,
    camera,
    lens,
    tag,
    simulation,
  ]);

  const { data, isLoading, isValidating, error, mutate, size, setSize } =
    useSwrInfinite<Photo[]>(
      keyGenerator,
      fetcher,
      {
        initialSize: ADMIN_DB_OPTIMIZE_ENABLED ? 0 : 2,
        revalidateFirstPage: false,
        revalidateOnFocus: Boolean(isUserSignedIn),
        revalidateOnReconnect: Boolean(isUserSignedIn),
      },
    );

  useEffect(() => {
    if (ADMIN_DB_OPTIMIZE_ENABLED) {
      fetcher(['', 0], true);
    }
  }, [fetcher]);

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

  useVisible({ ref: buttonContainerRef, onVisible: () => {
    if (ADMIN_DB_OPTIMIZE_ENABLED && size === 0) {
      advance();
    }
  }});

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
      {children({
        photos, 
        onLastPhotoVisible: advance,
        revalidatePhoto,
      })}
      {!isFinished && (wrapMoreButtonInGrid
        ? <AppGrid contentMain={renderMoreButton()} />
        : renderMoreButton())}
    </div>
  );
}
