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
import { FilmSimulation } from '@/simulation';
import {
  getPhotosMetaCached,
  getPhotosNearIdCached,
} from '@/photo/cache';
import { cache } from 'react';

const getPhotosNearIdCachedCached = cache((
  photoId: string,
  simulation: FilmSimulation,
) =>
  getPhotosNearIdCached(
    photoId,
    { simulation, limit: RELATED_GRID_PHOTOS_TO_SHOW + 2 },
  ));

interface PhotoFilmSimulationProps {
  params: Promise<{ photoId: string, simulation: FilmSimulation }>
}

export async function generateMetadata({
  params,
}: PhotoFilmSimulationProps): Promise<Metadata> {
  const { photoId, simulation } = await params;

  const { photo } = await getPhotosNearIdCachedCached(photoId, simulation);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto({ photo, simulation });

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

export default async function PhotoFilmSimulationPage({
  params,
}: PhotoFilmSimulationProps) {
  const { photoId, simulation } = await params;

  const { photo, photos, photosGrid, indexNumber } =
    await getPhotosNearIdCachedCached(photoId, simulation);

  if (!photo) { redirect(PATH_ROOT); }

  const { count, dateRange } = await getPhotosMetaCached({ simulation });

  return (
    <PhotoDetailPage {...{
      photo,
      photos,
      photosGrid,
      simulation,
      indexNumber,
      count,
      dateRange,
    }} />
  );
}
