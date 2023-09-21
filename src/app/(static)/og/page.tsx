import { getPhotosCached, getPhotosCountCached } from '@/cache';
import MorePhotos from '@/components/MorePhotos';
import { getPhotosLimitForQuery } from '@/photo';
import StaggeredOgPhotos from '@/photo/StaggeredOgPhotos';

export const runtime = 'edge';

export default async function GridPage({
  searchParams,
}: {
  searchParams: { next: string };
}) {
  const { offset, limit } = getPhotosLimitForQuery(searchParams.next);

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
        <MorePhotos path={`/og?next=${offset + 1}`} />}
    </div>
  );
}
