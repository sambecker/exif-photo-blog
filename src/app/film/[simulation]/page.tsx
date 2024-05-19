import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import { FilmSimulation, generateMetaForFilmSimulation } from '@/simulation';
import FilmSimulationOverview from '@/simulation/FilmSimulationOverview';
import { getPhotosFilmSimulationDataCached } from '@/simulation/data';
import { Metadata } from 'next/types';
import { cache } from 'react';

const getPhotosFilmSimulationDataCachedCached =
  cache(getPhotosFilmSimulationDataCached);

interface FilmSimulationProps {
  params: { simulation: FilmSimulation }
}

export async function generateMetadata({
  params: { simulation },
}: FilmSimulationProps): Promise<Metadata> {
  const [
    photos,
    { count, dateRange },
  ] = await getPhotosFilmSimulationDataCachedCached({
    simulation,
    limit: GRID_THUMBNAILS_TO_SHOW_MAX,
  });

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForFilmSimulation(simulation, photos, count, dateRange);

  return {
    title,
    openGraph: {
      title,
      description,
      images,
      url,
    },
    twitter: {
      images,
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function FilmSimulationPage({
  params: { simulation },
}: FilmSimulationProps) {
  const [
    photos,
    { count, dateRange },
  ] =  await getPhotosFilmSimulationDataCachedCached({
    simulation,
    limit: GRID_THUMBNAILS_TO_SHOW_MAX,
  });

  return (
    <FilmSimulationOverview {...{
      simulation,
      photos,
      count,
      dateRange,
    }} />
  );
}
