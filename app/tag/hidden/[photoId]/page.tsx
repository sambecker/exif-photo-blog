import {
  RELATED_GRID_PHOTOS_TO_SHOW,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import {
  getPhotosNearIdCached,
} from '@/photo/cache';
import { getPhotosMeta } from '@/photo/db/query';
import { PATH_ROOT, absolutePathForPhoto } from '@/app-core/paths';
import { TAG_HIDDEN } from '@/tag';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const getPhotosNearIdCachedCached = cache((photoId: string) =>
  getPhotosNearIdCached(
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

  const { photo } = await getPhotosNearIdCachedCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const url = absolutePathForPhoto({ photo, tag: TAG_HIDDEN });

  return {
    title,
    description,
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

export default async function PhotoTagHiddenPage({
  params,
}: PhotoTagProps) {
  const { photoId } = await params;

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId);

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
      tag: TAG_HIDDEN,
      shouldShare: false,
      includeFavoriteInAdminMenu: false,
    }} />
  );
}
