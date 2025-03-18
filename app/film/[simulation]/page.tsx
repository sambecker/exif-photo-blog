import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getUniqueFilmSimulations } from '@/photo/db/query';
import { FilmSimulation, generateMetaForFilmSimulation } from '@/simulation';
import FilmSimulationOverview from '@/simulation/FilmSimulationOverview';
import { getPhotosFilmSimulationDataCached } from '@/simulation/data';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { PATH_ROOT } from '@/app/paths';
import { redirect } from 'next/navigation';
import { shouldGenerateStaticParamsForCategory } from '@/category';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
const getPhotosFilmSimulationDataCachedCached =
  cache(getPhotosFilmSimulationDataCached);

export let generateStaticParams:
  (() => Promise<{ simulation: FilmSimulation }[]>) | undefined = undefined;

if (shouldGenerateStaticParamsForCategory('films', 'page')) {
  generateStaticParams = async () => {
    const simulations = await getUniqueFilmSimulations();
    return simulations
      .map(({ simulation }) => ({ simulation }))
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT);
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

  if (photos.length === 0) { return {}; }

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

  if (photos.length === 0) { redirect(PATH_ROOT); } 

  return (
    <FilmSimulationOverview {...{
      simulation,
      photos,
      count,
      dateRange,
    }} />
  );
}
