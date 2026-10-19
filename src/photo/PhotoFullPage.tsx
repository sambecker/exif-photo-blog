import { ADMIN_STORAGE_DEBUG_ENABLED } from '@/app/config';
import {
  INFINITE_SCROLL_FULL_MULTIPLE,
  Photo,
} from '.';
import PhotosFull from './PhotosFull';
import PhotosFullInfinite from './PhotosFullInfinite';
import { SortBy } from './sort';
import { PATH_FULL_INFERRED } from '@/app/path';

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
    <div className="space-y-12 md:space-y-16">
      <PhotosFull {...{ photos, showStorageCheck }} />
      {photosCount > photos.length &&
        <PhotosFullInfinite
          cacheKey={`page-${PATH_FULL_INFERRED}`}
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
