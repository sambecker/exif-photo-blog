import { getPhotosCached, getPhotosCountCached } from '@/cache';
import AnimateItems from '@/components/AnimateItems';
import MorePhotos from '@/photo/MorePhotos';
import SiteGrid from '@/components/SiteGrid';
import { generateOgImageMetaForPhotos } from '@/photo';
import PhotoLarge from '@/photo/PhotoLarge';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import {
  PaginationParams,
  getPaginationForSearchParams,
} from '@/site/pagination';
import { pathForRoot } from '@/site/paths';
import { Metadata } from 'next';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/photo/image-response';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG });
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage({ searchParams }: PaginationParams) {
  const { offset, limit } = getPaginationForSearchParams(searchParams, 12);

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
            contentMain={<MorePhotos path={pathForRoot(offset + 1)} />}
          />}
      </div>
      : <PhotosEmptyState />
  );
}
