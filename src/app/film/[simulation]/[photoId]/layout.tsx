import {
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
import { getPhotoCached } from '@/photo/cache';
import { ReactNode, cache } from 'react';
import { FilmSimulation } from '@/simulation';
import { getPhotosFilmSimulationDataCached } from '@/simulation/data';

const getPhotoCachedCached =
  cache((photoId: string) => getPhotoCached(photoId));

interface PhotoFilmSimulationProps {
  params: { photoId: string, simulation: FilmSimulation }
}

export async function generateMetadata({
  params: { photoId, simulation },
}: PhotoFilmSimulationProps): Promise<Metadata> {
  const photo = await getPhotoCachedCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto(photo, simulation);

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
  params: { photoId, simulation },
  children,
}: PhotoFilmSimulationProps & { children: ReactNode }) {
  const photo = await getPhotoCachedCached(photoId);

  if (!photo) { redirect(PATH_ROOT); }

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosFilmSimulationDataCached({ simulation });

  return <>
    {children}
    <PhotoDetailPage {...{ photo, photos, simulation, count, dateRange }} />
  </>;
}
