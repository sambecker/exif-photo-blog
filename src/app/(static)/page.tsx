import { getPhotosCached, getPhotosCountCached } from '@/cache';
import AnimateItems from '@/components/AnimateItems';
import MorePhotos from '@/components/MorePhotos';
import SiteGrid from '@/components/SiteGrid';
import { generateOgImageMetaForPhotos, getPhotosLimitForQuery } from '@/photo';
import PhotoLarge from '@/photo/PhotoLarge';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached();
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { next: string };
}) {
  const { offset, limit } = getPhotosLimitForQuery(searchParams.next, 12);

  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ limit }),
    getPhotosCountCached(),
  ]);
  
  const showMorePhotos = count > photos.length;

  return (
    photos.length > 0
      ? <div className="space-y-4">
        <AnimateItems
          className="space-y-1"
          duration={0.7}
          staggerDelay={0.15}
          distanceOffset={0}
          staggerOnFirstLoadOnly
          items={photos.map((photo, index) =>
            <PhotoLarge
              key={photo.id}
              photo={photo}
              priority={index <= 1}
            />)}
        />
        {showMorePhotos &&
          <SiteGrid
            contentMain={<MorePhotos path={`?next=${offset + 1}`} />}
          />}
      </div>
      : <PhotosEmptyState />
  );
}
