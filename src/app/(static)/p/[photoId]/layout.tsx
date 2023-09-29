import {
  GRID_THUMBNAILS_TO_SHOW_MAX,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  PATH_ROOT,
  absolutePathForPhoto,
  absolutePathForPhotoImage,
} from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotoCached, getPhotosCached } from '@/cache';
import { getPhotos } from '@/services/postgres';

export async function generateStaticParams() {
  const photos = await getPhotos();
  return photos.map(photo => ({
    params: { photoId: photo.id },
  }));
}

export async function generateMetadata({
  params: { photoId },
}: {
  params: { photoId: string }
}): Promise<Metadata> {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
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
  const photo = await getPhotoCached(photoId);

  if (!photo) { redirect(PATH_ROOT); }

  const [
    photosBefore,
    photosAfter,
  ] = await Promise.all([
    getPhotosCached({ takenBefore: photo.takenAt, limit: 1 }),
    getPhotosCached({
      takenAfterInclusive: photo.takenAt,
      limit: GRID_THUMBNAILS_TO_SHOW_MAX + 1,
    }),
  ]);

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
