'use client';

import InfinitePhotoScroll, {
  InfinitePhotoScrollExternalProps,
} from '../photo/InfinitePhotoScroll';
import AdminPhotosTable from './AdminPhotosTable';

export default function AdminPhotosTableInfinite({
  initialOffset,
  itemsPerPage,
}: InfinitePhotoScrollExternalProps) {
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
