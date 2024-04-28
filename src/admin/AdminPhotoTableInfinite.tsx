'use client';

import InfinitePhotoScroll, {
  InfinitePhotoScrollExternalProps,
} from '../photo/InfinitePhotoScroll';
import AdminPhotoTable from './AdminPhotoTable';

export default function AdminPhotoTableInfinite({
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
        <AdminPhotoTable
          photos={photos}
          onLastPhotoVisible={onLastPhotoVisible}
          revalidatePhoto={revalidatePhoto}
        />}
    </InfinitePhotoScroll>
  );
}
