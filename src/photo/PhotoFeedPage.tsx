import {
  INFINITE_SCROLL_FEED_MULTIPLE,
  Photo,
} from '.';
import PhotosLarge from './PhotosLarge';
import PhotosLargeInfinite from './PhotosLargeInfinite';
import { SortBy } from './db/sort';

export default function PhotoFeedPage({
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
  return (
    <div className="space-y-1">
      <PhotosLarge {...{ photos }} />
      {photosCount > photos.length &&
        <PhotosLargeInfinite
          sortBy={sortBy}
          sortWithPriority={sortWithPriority}
          initialOffset={photos.length}
          itemsPerPage={INFINITE_SCROLL_FEED_MULTIPLE}
        />}
    </div>
  );
}
