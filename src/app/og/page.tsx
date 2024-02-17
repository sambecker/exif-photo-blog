import { getPhotosCached, getPhotosCountCached } from '@/photo/cache';
import MoreComponentsFromSearchParams from
  '@/components/MoreComponentsFromSearchParams';
import StaggeredOgPhotos from '@/photo/StaggeredOgPhotos';
import {
  PaginationParams,
  getPaginationFromSearchParams,
} from '@/site/pagination';
import { pathForOg } from '@/site/paths';

export default async function GridPage({ searchParams }: PaginationParams) {
  const { offset, limit } = getPaginationFromSearchParams(searchParams);

  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ limit }),
    getPhotosCountCached(),
  ]);

  const showMorePhotos = count > photos.length;
  
  return (
    <div className="space-y-3">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <StaggeredOgPhotos photos={photos} />
      </div>
      {showMorePhotos &&
        <MoreComponentsFromSearchParams
          label="More photos"
          path={pathForOg(offset + 1)}
        />}
    </div>
  );
}
