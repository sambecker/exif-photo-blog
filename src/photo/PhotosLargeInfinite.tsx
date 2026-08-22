'use client';

import { PATH_FULL_INFERRED } from '@/app/path';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotosLarge from './PhotosLarge';
import { SortBy } from './sort';
import { PhotoSetCategory } from '../category';

export default function PhotosLargeInfinite({
  cacheKey = `page-${PATH_FULL_INFERRED}`,
  initialOffset,
  itemsPerPage,
  sortBy,
  sortWithPriority,
  excludeFromFeeds,
  showStorageCheck,
  ...categories
}: {
  cacheKey?: string
  initialOffset: number
  itemsPerPage: number
  sortBy?: SortBy
  sortWithPriority?: boolean
  excludeFromFeeds?: boolean
  showStorageCheck?: boolean
} & PhotoSetCategory) {
  return (
    <InfinitePhotoScroll
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      sortBy={sortBy}
      sortWithPriority={sortWithPriority}
      excludeFromFeeds={excludeFromFeeds}
      wrapMoreButtonInGrid
      {...categories}
    >
      {({ key, photos, onLastPhotoVisible, revalidatePhoto }) =>
        <PhotosLarge
          key={key}
          {...{
            photos,
            ...categories,
            onLastPhotoVisible,
            revalidatePhoto,
            showStorageCheck,
          }}
        />}
    </InfinitePhotoScroll>
  );
}
