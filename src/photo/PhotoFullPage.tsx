import { ADMIN_STORAGE_DEBUG_ENABLED } from '@/app/config';
import {
  INFINITE_SCROLL_FULL_MULTIPLE,
  Photo,
} from '.';
import PhotosLarge from './PhotosLarge';
import PhotosLargeInfinite from './PhotosLargeInfinite';
import { SortBy } from './sort';

export default function PhotoFullPage({
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
    <div className="space-y-1">
      <PhotosLarge {...{ photos, showStorageCheck }} />
      {photosCount > photos.length &&
        <PhotosLargeInfinite
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
