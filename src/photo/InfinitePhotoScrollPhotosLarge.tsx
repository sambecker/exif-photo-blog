'use client';

import InfinitePhotoScroll, {
  InfinitePhotoScrollExternalProps,
} from './InfinitePhotoScroll';
import PhotosLarge from './PhotosLarge';

export default function InfinitePhotoScrollPhotosLarge({
  initialOffset,
  itemsPerPage,
}: InfinitePhotoScrollExternalProps) {
  return (
    <InfinitePhotoScroll
      cacheKey="PhotosLarge"
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      wrapMoreButtonInGrid
    >
      {({ photos, onLastPhotoVisible, revalidatePhoto }) =>
        <PhotosLarge {...{
          photos,
          onLastPhotoVisible,
          revalidatePhoto,
        }} />}
    </InfinitePhotoScroll>
  );
}
