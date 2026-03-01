'use client';

import useSwrInfinite from 'swr/infinite';
import { ReactNode, useCallback, useMemo, useRef } from 'react';
import AppGrid from '@/components/AppGrid';
import Spinner from '@/components/Spinner';
import { getPhotosCachedAction, getPhotosAction } from '@/photo/actions';
import { Photo } from '.';
import { PhotoSetCategory } from '../category';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/app/AppState';
import useVisibility from '@/utility/useVisibility';
import { SortBy } from './sort';
import { SWR_KEYS } from '@/swr';
import { useAppText } from '@/i18n/state/client';

const SIZE_KEY_SEPARATOR = '__';
const getSizeFromKey = (key: string) =>
  parseInt(key.split(SIZE_KEY_SEPARATOR)[1]);

export type RevalidatePhoto = (
  photoId: string,
  revalidateRemainingPhotos?: boolean,
) => Promise<any>;

export default function InfinitePhotoScroll({
  cacheKey,
  initialOffset,
  itemsPerPage,
  sortBy,
  sortWithPriority,
  excludeFromFeeds,
  recent,
  year,
  camera,
  lens,
  tag,
  recipe,
  film,
  focal,
  moreButtonClassName = 'mt-4',
  wrapMoreButtonInGrid,
  useCachedPhotos = true,
  includeHiddenPhotos,
  children,
}: {
  initialOffset: number
  itemsPerPage: number
  sortBy?: SortBy
  sortWithPriority?: boolean
  excludeFromFeeds?: boolean
  cacheKey: string
  moreButtonClassName?: string
  wrapMoreButtonInGrid?: boolean
  useCachedPhotos?: boolean
  includeHiddenPhotos?: boolean
  children: (props: {
    key: string
    photos: Photo[]
    onLastPhotoVisible?: () => void
    revalidatePhoto?: RevalidatePhoto
  }) => ReactNode
} & PhotoSetCategory) {
  const { isUserSignedIn } = useAppState();
  
  const { utility } = useAppText();

  const keyGenerator = useCallback(
    (size: number, prev: Photo[]) => prev && prev.length === 0
      ? null
      // eslint-disable-next-line max-len
      : `${SWR_KEYS.INFINITE_PHOTO_SCROLL}-${cacheKey}${SIZE_KEY_SEPARATOR}${size}`
    , [cacheKey]);

  const fetcher = useCallback((
    keyWithSize: string,
    warmOnly?: boolean,
  ) =>
    (useCachedPhotos ? getPhotosCachedAction : getPhotosAction)({
      offset: initialOffset + getSizeFromKey(keyWithSize) * itemsPerPage,
      sortBy, 
      sortWithPriority,
      excludeFromFeeds,
      limit: itemsPerPage,
      hidden: includeHiddenPhotos ? 'include' : 'exclude',
      recent,
      year,
      camera,
      lens,
      tag,
      recipe,
      film,
      focal,
    }, warmOnly)
  , [
    useCachedPhotos,
    sortBy,
    sortWithPriority,
    excludeFromFeeds,
    initialOffset,
    itemsPerPage,
    includeHiddenPhotos,
    recent,
    year,
    camera,
    lens,
    tag,
    recipe,
    film,
    focal,
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
      setSize((data?.length ?? 0) + 1);
    }
  }, [isFinished, isLoadingOrValidating, setSize, data]);

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

  useVisibility({ ref: buttonContainerRef, onVisible: advance });

  const renderMoreButton =
    <div ref={buttonContainerRef}>
      <button
        type="button"
        onClick={() => error ? mutate() : advance()}
        disabled={isLoading || isValidating}
        className={clsx(
          'w-full flex justify-center',
          isLoadingOrValidating && 'subtle',
        )}
      >
        {error
          ? utility.tryAgain
          : isLoadingOrValidating
            ? <Spinner size={20} />
            : utility.loadMore}
      </button>
    </div>;

  return (
    <>
      {data?.map((photos, index) => (
        children({
          key: `${cacheKey}-${index}`,
          photos, 
          onLastPhotoVisible: index === data.length - 1
            ? advance
            : undefined,
          revalidatePhoto,
        })
      ))}
      {!isFinished && <div className={moreButtonClassName}>
        {wrapMoreButtonInGrid
          ? <AppGrid contentMain={renderMoreButton} />
          : renderMoreButton}
      </div>}
    </>
  );
}
