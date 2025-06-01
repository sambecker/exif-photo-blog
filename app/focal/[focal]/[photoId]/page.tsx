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
import { getPhotosNearIdCached, getPhotosMetaCached } from '@/photo/cache';
import { cache } from 'react';
import { getFocalLengthFromString } from '@/focal';

const getPhotosNearIdCachedCached = cache((photoId: string, focal: number) =>
  getPhotosNearIdCached(
    photoId,
    { focal, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoFocalLengthProps {
  params: Promise<{ photoId: string, focal: string }>
}

export async function generateMetadata({
  params,
}: PhotoFocalLengthProps): Promise<Metadata> {
  const { photoId, focal: focalString } = await params;

  const focal = getFocalLengthFromString(focalString);

  const { photo } = await getPhotosNearIdCachedCached(photoId, focal);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, focal });

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

export default async function PhotoFocalLengthPage({
  params,
}: PhotoFocalLengthProps) {
  const { photoId, focal: focalString } = await params;

  const focal = getFocalLengthFromString(focalString);

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, focal);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMetaCached({ focal });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      focal,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
