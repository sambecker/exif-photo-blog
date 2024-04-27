import {
  GRID_THUMBNAILS_TO_SHOW_MAX,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import {
  PATH_ROOT,
  absolutePathForPhoto,
  absolutePathForPhotoImage,
} from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotosNearIdCachedCached } from '@/photo/cache';

interface PhotoProps {
  params: { photoId: string }
}

export async function generateMetadata({
  params: { photoId },
}:PhotoProps): Promise<Metadata> {
  const { photo } = await getPhotosNearIdCachedCached(
    photoId,
    GRID_THUMBNAILS_TO_SHOW_MAX + 2,
  );

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
}: PhotoProps & { children: React.ReactNode }) {
  const { photos, photo } = await getPhotosNearIdCachedCached(
    photoId,
    GRID_THUMBNAILS_TO_SHOW_MAX + 2,
  );

  if (!photo) { redirect(PATH_ROOT); }
  
  const isPhotoFirst = photos.findIndex(p => p.id === photoId) === 0;

  return <>
    {children}
    <PhotoDetailPage
      photo={photo}
      photos={photos}
      photosGrid={photos.slice(
        isPhotoFirst ? 1 : 2,
        isPhotoFirst
          ? GRID_THUMBNAILS_TO_SHOW_MAX + 1
          : GRID_THUMBNAILS_TO_SHOW_MAX + 2,
      )}
    />
  </>;
}
