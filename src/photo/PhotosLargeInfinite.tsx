'use client';

import { PATH_FULL_INFERRED } from '@/app/paths';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotosLarge from './PhotosLarge';
import { SortBy } from './db/sort';

export default function PhotosLargeInfinite({
  initialOffset,
  itemsPerPage,
  sortBy,
  excludeFromFeeds,
}: {
  initialOffset: number
  itemsPerPage: number
  sortBy: SortBy
  sortWithPriority: boolean
  excludeFromFeeds?: boolean
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
      {({ photos, onLastPhotoVisible, revalidatePhoto }) =>
        <PhotosLarge
          photos={photos}
          onLastPhotoVisible={onLastPhotoVisible}
          revalidatePhoto={revalidatePhoto}
        />}
    </InfinitePhotoScroll>
  );
}
