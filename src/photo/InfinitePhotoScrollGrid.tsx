'use client';

import InfinitePhotoScroll, {
  InfinitePhotoScrollExternalProps,
} from './InfinitePhotoScroll';
import PhotoGrid from './PhotoGrid';

export default function InfinitePhotoScrollGrid({
  initialOffset,
  itemsPerPage,
}: InfinitePhotoScrollExternalProps) {
  return (
    <InfinitePhotoScroll
      cacheKey="Grid"
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      wrapMoreButtonInGrid={false}
    >
      {({ photos, onLastPhotoVisible }) =>
        <PhotoGrid {...{
          photos,
          onLastPhotoVisible,
        }} />}
    </InfinitePhotoScroll>
  );
}
