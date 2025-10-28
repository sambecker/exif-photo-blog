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

const getPhotosNearIdCached = cache((photoId: string, year: string) =>
  getPhotosNearId(
    photoId,
    { year, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoYearProps {
  params: Promise<{ photoId: string, year: string }>
}

export async function generateMetadata({
  params,
}: PhotoYearProps): Promise<Metadata> {
  const { photoId, year } = await params;

  const { photo } = await getPhotosNearIdCached(photoId, year);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, year });

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

export default async function PhotoYearPage({
  params,
}: PhotoYearProps) {
  const { photoId, year } = await params;

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCached(photoId, year);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMeta({ year });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      year,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
