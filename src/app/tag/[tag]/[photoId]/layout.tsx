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
} from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotosNearIdCached } from '@/photo/cache';
import { ReactNode, cache } from 'react';
import { getPhotosMeta } from '@/photo/db/query';

const getPhotosNearIdCachedCached = cache((photoId: string, tag: string) =>
  getPhotosNearIdCached(
    photoId,
    { tag, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoTagProps {
  params: { photoId: string, tag: string }
}

export async function generateMetadata({
  params: { photoId, tag },
}: PhotoTagProps): Promise<Metadata> {
  const { photo } = await getPhotosNearIdCachedCached(photoId, tag);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto(photo, tag);

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
  params: { photoId, tag },
  children,
}: PhotoTagProps & { children: ReactNode }) {
  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, tag);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMeta({ tag });

  return <>
    {children}
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      tag,
      indexNumber,
      count,
      dateRange,
    }} />
  </>;
}
