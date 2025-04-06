import {
  INFINITE_SCROLL_GRID_INITIAL,
  INFINITE_SCROLL_GRID_MULTIPLE,
} from '@/photo';
import { getPhotosCached, getPhotosMetaCached } from '@/photo/cache';
import StaggeredOgPhotos from '@/photo/StaggeredOgPhotos';
import StaggeredOgPhotosInfinite from '@/photo/StaggeredOgPhotosInfinite';

export default async function OGPage() {
  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ limit: INFINITE_SCROLL_GRID_INITIAL })
      .catch(() => []),
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
  ]);
  
  return (
    <>
      <StaggeredOgPhotos {...{ photos }} />
      {count > photos.length &&
        <div className="mt-3">
          <StaggeredOgPhotosInfinite
            initialOffset={photos.length}
            itemsPerPage={INFINITE_SCROLL_GRID_MULTIPLE}
          />
        </div>}
    </>
  );
}
