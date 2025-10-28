import {
  RELATED_GRID_PHOTOS_TO_SHOW,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { PATH_ROOT, absolutePathForPhoto } from '@/app/path';
import { TAG_PRIVATE } from '@/tag';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getPhotosNearId } from '@/photo/data';
import { getPhotosMeta } from '@/photo/query';

const getPhotosNearIdCached = cache((photoId: string) =>
  getPhotosNearId(
    photoId,
    { hidden: 'only' , limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoTagProps {
  params: Promise<{ photoId: string }>
}

export async function generateMetadata({
  params,
}: PhotoTagProps): Promise<Metadata> {
  const { photoId } = await params;

  const { photo } = await getPhotosNearIdCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const url = absolutePathForPhoto({ photo, tag: TAG_PRIVATE });

  return {
    title,
    description: descriptionHtml,
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  };
}

export default async function PhotoTagPrivatePage({
  params,
}: PhotoTagProps) {
  const { photoId } = await params;

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCached(photoId);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMeta({ hidden: 'only' });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      indexNumber,
      count,
      dateRange,
      tag: TAG_PRIVATE,
      shouldShare: false,
      includeFavoriteInAdminMenu: false,
    }} />
  );
}
