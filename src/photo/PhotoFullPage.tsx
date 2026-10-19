import {
  ADMIN_STORAGE_DEBUG_ENABLED,
  EXPRESSIVE_LAYOUT_ENABLED,
} from '@/app/config';
import {
  INFINITE_SCROLL_FULL_MULTIPLE,
  Photo,
} from '.';
import PhotosLarge from './PhotosLarge';
import PhotosLargeInfinite from './PhotosLargeInfinite';
import PhotosFull, { PHOTOS_FULL_SPACING } from './PhotosFull';
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
  const infiniteProps = {
    cacheKey: `page-${PATH_FULL_INFERRED}`,
    initialOffset: photos.length,
    itemsPerPage: INFINITE_SCROLL_FULL_MULTIPLE,
    sortBy,
    sortWithPriority,
    excludeFromFeeds: true as const,
    showStorageCheck,
  };

  if (EXPRESSIVE_LAYOUT_ENABLED) {
    return (
      <div className={PHOTOS_FULL_SPACING}>
        <PhotosFull {...{ photos, showStorageCheck }} />
        {photosCount > photos.length &&
          <PhotosFullInfinite {...infiniteProps} />}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <PhotosLarge {...{ photos, showStorageCheck }} />
      {photosCount > photos.length &&
        <PhotosLargeInfinite {...infiniteProps} />}
    </div>
  );
}
