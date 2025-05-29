import {
  INFINITE_SCROLL_FEED_MULTIPLE,
  Photo,
} from '.';
import PhotosLarge from './PhotosLarge';
import PhotosLargeInfinite from './PhotosLargeInfinite';

export default function PhotoFeedPage({
  photos,
  photosCount,
}:{
  photos: Photo[]
  photosCount: number
}) {
  return (
    <div className="space-y-1">
      <PhotosLarge {...{ photos }} />
      {photosCount > photos.length &&
        <PhotosLargeInfinite
          initialOffset={photos.length}
          itemsPerPage={INFINITE_SCROLL_FEED_MULTIPLE}
        />}
    </div>
  );
}
