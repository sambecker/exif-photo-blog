'use client';

import { PATH_ADMIN_PHOTOS } from '@/app-core/paths';
import InfinitePhotoScroll from '../photo/InfinitePhotoScroll';
import AdminPhotosTable from './AdminPhotosTable';
import { ComponentProps } from 'react';

export default function AdminPhotosTableInfinite({
  initialOffset,
  itemsPerPage,
  hasAiTextGeneration,
  canEdit,
  canDelete,
}: {
  initialOffset: number
  itemsPerPage: number
} & Omit<ComponentProps<typeof AdminPhotosTable>, 'photos'>) {
  return (
    <InfinitePhotoScroll
      cacheKey={`page-${PATH_ADMIN_PHOTOS}`}
      initialOffset={initialOffset}
      itemsPerPage={itemsPerPage}
      useCachedPhotos={false}
      sortBy="createdAt"
      includeHiddenPhotos
    >
      {({ photos, onLastPhotoVisible, revalidatePhoto }) =>
        <AdminPhotosTable
          photos={photos}
          onLastPhotoVisible={onLastPhotoVisible}
          revalidatePhoto={revalidatePhoto}
          hasAiTextGeneration={hasAiTextGeneration}
          canEdit={canEdit}
          canDelete={canDelete}
        />}
    </InfinitePhotoScroll>
  );
}
