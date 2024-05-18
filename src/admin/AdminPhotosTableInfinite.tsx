'use client';

import InfinitePhotoScroll from '../photo/InfinitePhotoScroll';
import AdminPhotosTable from './AdminPhotosTable';

export default function AdminPhotosTableInfinite({
  initialOffset,
  itemsPerPage,
}: {
  initialOffset: number
  itemsPerPage: number
}) {
  return (
    <InfinitePhotoScroll
      cacheKey="AdminPhotoTable"
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      useCachedPhotos={false}
      includeHiddenPhotos
    >
      {({ photos, onLastPhotoVisible, revalidatePhoto }) =>
        <AdminPhotosTable
          photos={photos}
          onLastPhotoVisible={onLastPhotoVisible}
          revalidatePhoto={revalidatePhoto}
        />}
    </InfinitePhotoScroll>
  );
}
