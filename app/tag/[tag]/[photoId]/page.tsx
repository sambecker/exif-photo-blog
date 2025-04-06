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
import { getPhotosMetaCached, getPhotosNearIdCached } from '@/photo/cache';
import { cache } from 'react';

const getPhotosNearIdCachedCached = cache((photoId: string, tag: string) =>
  getPhotosNearIdCached(
    photoId,
    { tag, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoTagProps {
  params: Promise<{ photoId: string, tag: string }>
}

export async function generateMetadata({
  params,
}: PhotoTagProps): Promise<Metadata> {
  const { photoId, tag: tagFromParams } = await params;

  const tag = decodeURIComponent(tagFromParams);

  const { photo } = await getPhotosNearIdCachedCached(photoId, tag);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, tag });

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

export default async function PhotoTagPage({
  params,
}: PhotoTagProps) {
  const { photoId, tag: tagFromParams } = await params;

  const tag = decodeURIComponent(tagFromParams);

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, tag);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMetaCached({ tag });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      tag,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
