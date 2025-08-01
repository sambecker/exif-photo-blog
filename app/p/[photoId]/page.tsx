import {
  RELATED_GRID_PHOTOS_TO_SHOW,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import {
  PATH_ROOT,
  absolutePathForPhoto,
  absolutePathForPhotoImage,
} from '@/app/path';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotoCached, getPhotosNearIdCached } from '@/photo/cache';
import { cache } from 'react';
import { staticallyGeneratePhotosIfConfigured } from '@/app/static';

export const maxDuration = 60;

const getPhotosNearIdCachedCached = cache(async (photoId: string) => {
  const photo = await getPhotoCached(photoId);
  // Omit related photos when photo is excluded from feeds
  return photo?.excludeFromFeeds
    ? {
      photo: photo,
      photos: [],
      photosGrid: [],
      indexNumber: 0,
    }
    :getPhotosNearIdCached(
      photoId, {
        limit: RELATED_GRID_PHOTOS_TO_SHOW + 2,
        excludeFromFeeds: true,
      },
    );
});

export const generateStaticParams = staticallyGeneratePhotosIfConfigured(
  'page',
);

interface PhotoProps {
  params: Promise<{ photoId: string }>
}

export async function generateMetadata({
  params,
}:PhotoProps): Promise<Metadata> {
  const { photoId } = await params;
  const { photo } = await getPhotosNearIdCachedCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo });

  return {
    title,
    description: descriptionHtml,
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
  params,
}: PhotoProps) {
  const { photoId } = await params;
  const { photo, photos, photosGrid } =
    await getPhotosNearIdCachedCached(photoId);

  if (!photo) { redirect(PATH_ROOT); }

  return (
    <PhotoDetailPage {...{ photo, photos, photosGrid }} />
  );
}
