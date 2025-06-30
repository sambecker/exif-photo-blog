'use client';

import { PATH_FEED_INFERRED } from '@/app/paths';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotosLarge from './PhotosLarge';
import { SortBy } from './db/sort';

export default function PhotosLargeInfinite({
  initialOffset,
  itemsPerPage,
  sortBy,
}: {
  initialOffset: number
  itemsPerPage: number
  sortBy: SortBy
  sortWithPriority: boolean
}) {
  return (
    <InfinitePhotoScroll
      cacheKey={`page-${PATH_FEED_INFERRED}`}
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      sortBy={sortBy}
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
