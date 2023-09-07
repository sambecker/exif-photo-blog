import AnimateItems from '@/components/AnimateItems';
import { generateImageMetaForPhoto } from '@/photo';
import PhotoLarge from '@/photo/PhotoLarge';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { getPhotos } from '@/services/postgres';
import { Metadata } from 'next';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotos();
  return generateImageMetaForPhoto(photos[0]);
}

export default async function HomePage() {
  const photos = await getPhotos();

  return (
    photos.length > 0
      ? <AnimateItems
        className="space-y-2"
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
      : <PhotosEmptyState />
  );
}
