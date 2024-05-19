import {
  INFINITE_SCROLL_INITIAL_GRID,
  INFINITE_SCROLL_MULTIPLE_GRID,
} from '@/photo';
import { getPhotosCached, getPhotosCountCached } from '@/photo/cache';
import StaggeredOgPhotos from '@/photo/StaggeredOgPhotos';
import StaggeredOgPhotosInfinite from '@/photo/StaggeredOgPhotosInfinite';

export default async function GridPage() {
  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ limit: INFINITE_SCROLL_INITIAL_GRID }),
    getPhotosCountCached(),
  ]);
  
  return (
    <>
      <StaggeredOgPhotos {...{ photos }} />
      {count > photos.length &&
        <div className="mt-3">
          <StaggeredOgPhotosInfinite
            initialOffset={photos.length}
            itemsPerPage={INFINITE_SCROLL_MULTIPLE_GRID}
          />
        </div>}
    </>
  );
}
