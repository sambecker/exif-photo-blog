import {
  INFINITE_SCROLL_GRID_PHOTO_INITIAL,
  INFINITE_SCROLL_GRID_PHOTO_MULTIPLE,
} from '@/photo';
import { getPhotosCached, getPhotosCountCached } from '@/photo/cache';
import StaggeredOgPhotos from '@/photo/StaggeredOgPhotos';
import StaggeredOgPhotosInfinite from '@/photo/StaggeredOgPhotosInfinite';

export default async function GridPage() {
  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ limit: INFINITE_SCROLL_GRID_PHOTO_INITIAL }),
    getPhotosCountCached(),
  ]);
  
  return (
    <>
      <StaggeredOgPhotos {...{ photos }} />
      {count > photos.length &&
        <div className="mt-3">
          <StaggeredOgPhotosInfinite
            initialOffset={photos.length}
            itemsPerPage={INFINITE_SCROLL_GRID_PHOTO_MULTIPLE}
          />
        </div>}
    </>
  );
}
