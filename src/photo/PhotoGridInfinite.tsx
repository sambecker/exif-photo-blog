'use client';

import InfinitePhotoScroll, {
  InfinitePhotoScrollExternalProps,
} from './InfinitePhotoScroll';
import PhotoGrid from './PhotoGrid';

export default function PhotoGridInfinite({
  initialOffset,
  itemsPerPage,
}: InfinitePhotoScrollExternalProps) {
  return (
    <InfinitePhotoScroll
      cacheKey="Grid"
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
    >
      {({ photos, onLastPhotoVisible }) =>
        <PhotoGrid
          photos={photos}
          onLastPhotoVisible={onLastPhotoVisible}
        />}
    </InfinitePhotoScroll>
  );
}
