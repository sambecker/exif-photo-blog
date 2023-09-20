import {
  GRID_THUMBNAILS_TO_SHOW_MAX,
  ogImageDescriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next';
import {
  getPhoto,
  getPhotos,
  getPhotosTakenAfterPhotoInclusive,
  getPhotosTakenBeforePhoto,
} from '@/services/postgres';
import { redirect } from 'next/navigation';
import { absolutePathForPhoto, absolutePathForPhotoImage } from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';

// Revalidate every 12 hours
export const revalidate = 43_200;

export async function generateStaticParams() {
  const photos = await getPhotos();
  return photos.map(photo => ({
    slug: photo.id,
  }));
}

export async function generateMetadata({
  params: { photoId },
}: {
  params: { photoId: string }
}): Promise<Metadata> {
  const photo = await getPhoto(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = ogImageDescriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto(photo);

  return {
    title,
    description,
    openGraph: {
      title,
      images,
      description,
      url,
    },
    twitter: {
      title,
      description,
      images,
      card: 'summary_large_image',
    },
  };
}

export default async function PhotoPage({
  params: { photoId },
  children,
}: {
  params: { photoId: string }
  children: React.ReactNode
}) {
  const photo = await getPhoto(photoId);

  if (!photo) { redirect('/'); }

  const photosBefore = await getPhotosTakenBeforePhoto(photo, 1);
  const photosAfter = await getPhotosTakenAfterPhotoInclusive(
    photo,
    GRID_THUMBNAILS_TO_SHOW_MAX + 1,
  );
  const photos = photosBefore.concat(photosAfter);

  return <>
    {children}
    <PhotoDetailPage
      photo={photo}
      photos={photos}
      photosGrid={photosAfter.slice(1)}
    />
  </>;
}
