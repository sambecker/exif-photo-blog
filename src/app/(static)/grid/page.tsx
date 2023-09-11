import MorePhotos from '@/components/MorePhotos';
import SiteGrid from '@/components/SiteGrid';
import { generateImageMetaForPhoto, getPhotosLimitForQuery } from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { getPhotos, getPhotosCount } from '@/services/postgres';
import { Metadata } from 'next';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotos();
  return generateImageMetaForPhoto(photos[0]);
}

export default async function GridPage({
  searchParams,
}: {
  searchParams: { next: string };
}) {
  const { offset, limit } = getPhotosLimitForQuery(searchParams.next);

  const photos = await getPhotos(undefined, limit);

  const count = await getPhotosCount();

  const showMorePhotos = count > photos.length;
  
  return (
    photos.length > 0
      ? <SiteGrid
        contentMain={<div className="space-y-4">
          <PhotoGrid
            photos={photos}
            staggerOnFirstLoadOnly
          />
          {showMorePhotos &&
            <MorePhotos path={`/grid?next=${offset + 1}`} />}
        </div>}
      />
      : <PhotosEmptyState />
  );
}
