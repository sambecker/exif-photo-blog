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

const getPhotosNearIdCached = cache((
  photoId: string,
  film: string,
) =>
  getPhotosNearId(
    photoId,
    { film, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoFilmProps {
  params: Promise<{ photoId: string, film: string }>
}

export async function generateMetadata({
  params,
}: PhotoFilmProps): Promise<Metadata> {
  const { photoId, film } = await params;

  const { photo } = await getPhotosNearIdCached(photoId, film);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const descriptionHtml = descriptionForPhoto(photo, true);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, film: film });

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

export default async function PhotoFilmPage({
  params,
}: PhotoFilmProps) {
  const { photoId, film } = await params;

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCached(photoId, film);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMeta({ film: film });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      film: film,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
