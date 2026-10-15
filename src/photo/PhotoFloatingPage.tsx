import { ADMIN_STORAGE_DEBUG_ENABLED } from '@/app/config';
import {
  INFINITE_SCROLL_FULL_MULTIPLE,
  Photo,
} from '.';
import PhotosFloating from './PhotosFloating';
import PhotosFloatingInfinite from './PhotosFloatingInfinite';
import { SortBy } from './sort';
import { PATH_FLOATING } from '@/app/path';

export default function PhotoFloatingPage({
  photos,
  photosCount,
  sortBy,
  sortWithPriority,
}:{
  photos: Photo[]
  photosCount: number
  sortBy: SortBy
  sortWithPriority: boolean
}) {
  const showStorageCheck = ADMIN_STORAGE_DEBUG_ENABLED;
  return (
    <div className="space-y-12 md:space-y-16">
      <PhotosFloating {...{ photos, showStorageCheck }} />
      {photosCount > photos.length &&
        <PhotosFloatingInfinite
          cacheKey={`page-${PATH_FLOATING}`}
          initialOffset={photos.length}
          itemsPerPage={INFINITE_SCROLL_FULL_MULTIPLE}
          sortBy={sortBy}
          sortWithPriority={sortWithPriority}
          excludeFromFeeds
          showStorageCheck={showStorageCheck}
        />}
    </div>
  );
}
