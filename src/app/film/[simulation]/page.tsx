import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getUniqueFilmSimulations } from '@/photo/db/query';
import { FilmSimulation, generateMetaForFilmSimulation } from '@/simulation';
import FilmSimulationOverview from '@/simulation/FilmSimulationOverview';
import { IS_PRODUCTION } from '@/site/config';
import { getPhotosFilmSimulationDataCached } from '@/simulation/data';
import { STATICALLY_OPTIMIZED_PHOTO_CATEGORIES } from '@/site/config';
import { Metadata } from 'next/types';
import { cache } from 'react';

const getPhotosFilmSimulationDataCachedCached =
  cache(getPhotosFilmSimulationDataCached);

export let generateStaticParams:
  (() => Promise<{ simulation: FilmSimulation }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORIES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const simulations = await getUniqueFilmSimulations();
    return simulations.map(({ simulation }) => ({ simulation }));
  };
}

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
  ] = await getPhotosFilmSimulationDataCachedCached({
    simulation,
    limit: INFINITE_SCROLL_GRID_INITIAL,
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
  params,
}: FilmSimulationProps) {
  const { simulation } = await params;

  const [
    photos,
    { count, dateRange },
  ] =  await getPhotosFilmSimulationDataCachedCached({
    simulation,
    limit: INFINITE_SCROLL_GRID_INITIAL,
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
