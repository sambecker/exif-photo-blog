'use client';

import useSwrInfinite from 'swr/infinite';
import {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import { getPhotosCachedAction, getPhotosAction } from '@/photo/actions';
import { Photo } from '.';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/state/AppState';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';

export type RevalidatePhoto = (
  photoId: string,
  revalidateRemainingPhotos?: boolean,
) => Promise<any>;

export default function InfinitePhotoScroll({
  cacheKey,
  initialOffset,
  itemsPerPage,
  tag,
  camera,
  simulation,
  wrapMoreButtonInGrid,
  useCachedPhotos = true,
  includeHiddenPhotos,
  children,
}: {
  initialOffset: number
  itemsPerPage: number
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  cacheKey: string
  wrapMoreButtonInGrid?: boolean
  useCachedPhotos?: boolean
  includeHiddenPhotos?: boolean
  children: (props: {
    photos: Photo[]
    onLastPhotoVisible: () => void
    revalidatePhoto?: RevalidatePhoto
  }) => ReactNode
}) {
  const { swrTimestamp, isUserSignedIn } = useAppState();

  const key = `${swrTimestamp}-${cacheKey}`;

  const keyGenerator = useCallback(
    (size: number, prev: Photo[]) => prev && prev.length === 0
      ? null
      : [key, size]
    , [key]);

  const fetcher = useCallback(([_key, size]: [string, number]) =>
    useCachedPhotos
      ? getPhotosCachedAction({
        offset: initialOffset + size * itemsPerPage,
        limit: itemsPerPage,
        hidden: includeHiddenPhotos ? 'include' : 'exclude',
        tag,
        camera,
        simulation,
      })
      : getPhotosAction({
        offset: initialOffset + size * itemsPerPage,
        limit: itemsPerPage,
        hidden: includeHiddenPhotos ? 'include' : 'exclude',
        tag,
        camera,
        simulation,
      })
  , [
    useCachedPhotos,
    initialOffset,
    itemsPerPage,
    includeHiddenPhotos,
    tag,
    camera,
    simulation,
  ]);

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
      {children({
        photos, 
        onLastPhotoVisible: advance,
        revalidatePhoto,
      })}
      {!isFinished && (wrapMoreButtonInGrid
        ? <SiteGrid contentMain={renderMoreButton()} />
        : renderMoreButton())}
    </div>
  );
}
