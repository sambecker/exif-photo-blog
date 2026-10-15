'use client';

import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotosFloating from './PhotosFloating';
import { SortBy } from './sort';

export default function PhotosFloatingInfinite({
  cacheKey,
  initialOffset,
  itemsPerPage,
  sortBy,
  sortWithPriority,
  excludeFromFeeds,
  showStorageCheck,
}: {
  cacheKey: string
  initialOffset: number
  itemsPerPage: number
  sortBy?: SortBy
  sortWithPriority?: boolean
  excludeFromFeeds?: boolean
  showStorageCheck?: boolean
}) {
  return (
    <InfinitePhotoScroll
      // Flatten pages so spacing/alternation stay consistent across loads
      initialPhotos={[]}
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      sortBy={sortBy}
      sortWithPriority={sortWithPriority}
      excludeFromFeeds={excludeFromFeeds}
    >
      {({ key, photos, onLastPhotoVisible, revalidatePhoto }) =>
        <PhotosFloating
          key={key}
          {...{
            photos,
            onLastPhotoVisible,
            revalidatePhoto,
            showStorageCheck,
            // Continue left/right alternation after the server-rendered page
            indexOffset: initialOffset,
          }}
        />}
    </InfinitePhotoScroll>
  );
}
