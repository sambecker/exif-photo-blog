'use client';

import { PATH_FULL_INFERRED } from '@/app/path';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotosLarge from './PhotosLarge';
import { SortBy } from './sort';

export default function PhotosLargeInfinite({
  initialOffset,
  itemsPerPage,
  sortBy,
  excludeFromFeeds,
  showStorageCheck,
}: {
  initialOffset: number
  itemsPerPage: number
  sortBy: SortBy
  sortWithPriority: boolean
  excludeFromFeeds?: boolean
  showStorageCheck?: boolean
}) {
  return (
    <InfinitePhotoScroll
      cacheKey={`page-${PATH_FULL_INFERRED}`}
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      sortBy={sortBy}
      excludeFromFeeds={excludeFromFeeds}
      wrapMoreButtonInGrid
    >
      {({ key, photos, onLastPhotoVisible, revalidatePhoto }) =>
        <PhotosLarge
          key={key}
          {...{
            photos,
            onLastPhotoVisible,
            revalidatePhoto,
            showStorageCheck,
          }}
        />}
    </InfinitePhotoScroll>
  );
}
