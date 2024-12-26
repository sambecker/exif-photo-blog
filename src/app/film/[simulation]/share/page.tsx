import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { FilmSimulation, generateMetaForFilmSimulation } from '@/simulation';
import FilmSimulationOverview from '@/simulation/FilmSimulationOverview';
import FilmSimulationShareModal from '@/simulation/FilmSimulationShareModal';
import { getPhotosFilmSimulationDataCached } from '@/simulation/data';
import { Metadata } from 'next/types';
import { cache } from 'react';

const getPhotosFilmSimulationDataCachedCached =
  cache((simulation: FilmSimulation) => getPhotosFilmSimulationDataCached({
    simulation,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  }));

interface FilmSimulationProps {
  params: Promise<{ simulation: FilmSimulation }>
}

export async function generateMetadata({
  params,
}: FilmSimulationProps): Promise<Metadata> {
  const { simulation } = await params;

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosFilmSimulationDataCachedCached(simulation);

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

export default async function Share({
  params,
}: FilmSimulationProps) {
  const { simulation } = await params;

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosFilmSimulationDataCachedCached(simulation);

  return <>
    <FilmSimulationShareModal {...{ simulation, photos, count, dateRange }} />
    <FilmSimulationOverview
      {...{ simulation, photos, count, dateRange }}
      animateOnFirstLoadOnly
    />
  </>;
}
