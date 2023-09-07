import SiteGrid from '@/components/SiteGrid';
import { generateImageMetaForPhoto } from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { getPhotos } from '@/services/postgres';
import { Metadata } from 'next';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotos();
  return generateImageMetaForPhoto(photos[0]);
}

export default async function GridPage() {
  const photos = await getPhotos();
  
  return (
    photos.length > 0
      ? <SiteGrid
        contentMain={<PhotoGrid
          photos={photos}
          staggerOnFirstLoadOnly
        />}
      />
      : <PhotosEmptyState />
  );
}
