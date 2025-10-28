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
import { cache } from 'react';
import { getPhotosNearId } from '@/photo/data';
import { getPhotosMeta } from '@/photo/query';

const getPhotosNearIdCached = cache((photoId: string, tag: string) =>
  getPhotosNearId(
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

  const { photo } = await getPhotosNearIdCached(photoId, tag);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, tag });

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

export default async function PhotoTagPage({
  params,
}: PhotoTagProps) {
  const { photoId, tag: tagFromParams } = await params;

  const tag = decodeURIComponent(tagFromParams);

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCached(photoId, tag);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMeta({ tag });

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
