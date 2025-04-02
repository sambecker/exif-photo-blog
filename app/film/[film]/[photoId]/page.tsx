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

const getPhotosNearIdCachedCached = cache((
  photoId: string,
  film: string,
) =>
  getPhotosNearIdCached(
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

  const { photo } = await getPhotosNearIdCachedCached(photoId, film);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, film: film });

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

export default async function PhotoFilmPage({
  params,
}: PhotoFilmProps) {
  const { photoId, film } = await params;

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, film);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMetaCached({ film: film });

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
