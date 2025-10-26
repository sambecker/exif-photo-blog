'use client';

import { PATH_OG } from '@/app/path';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import StaggeredOgPhotos from './StaggeredOgPhotos';

export default function StaggeredOgPhotosInfinite({
  initialOffset,
  itemsPerPage,
}: {
  initialOffset: number
  itemsPerPage: number
}) {
  return (
    <InfinitePhotoScroll
      cacheKey={`page-${PATH_OG}`}
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
    >
      {({ key, photos, onLastPhotoVisible }) =>
        <StaggeredOgPhotos
          key={key}
          photos={photos}
          onLastPhotoVisible={onLastPhotoVisible}
        />}
    </InfinitePhotoScroll>
  );
}
