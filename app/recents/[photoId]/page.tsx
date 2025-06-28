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
} from '@/app/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import {
  getPhotosMetaCached,
  getPhotosNearIdCached,
} from '@/photo/cache';
import { cache } from 'react';
import RecentsHeader from '@/recents/RecentsHeader';

const getPhotosNearIdCachedCached = cache((photoId: string) =>
  getPhotosNearIdCached(
    photoId,
    { recent: true, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoRecentsProps {
  params: Promise<{ photoId: string }>
}

export async function generateMetadata({
  params,
}: PhotoRecentsProps): Promise<Metadata> {
  const { photoId } = await params;

  const { photo } = await getPhotosNearIdCachedCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, recent: true });

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

export default async function PhotoRecentsPage({
  params,
}: PhotoRecentsProps) {
  const { photoId } = await params;

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMetaCached({ recent: true });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      recent: true,
      indexNumber,
      count,
      dateRange,
      header: <RecentsHeader
        photos={photos}
        selectedPhoto={photo}
        indexNumber={indexNumber}
        count={count}
        dateRange={dateRange}
      />,
    }} />
  );
} 