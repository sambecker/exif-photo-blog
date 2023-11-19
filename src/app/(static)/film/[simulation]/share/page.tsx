import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import { FilmSimulation, generateMetaForFilmSimulation } from '@/simulation';
import FilmSimulationOverview from '@/simulation/FilmSimulationOverview';
import FilmSimulationShareModal from '@/simulation/FilmSimulationShareModal';
import {
  getPhotosFilmSimulationDataCached,
  getPhotosFilmSimulationDataCachedWithPagination,
} from '@/simulation/data';
import { PaginationParams } from '@/site/pagination';
import { Metadata } from 'next';

interface FilmSimulationProps {
  params: { simulation: FilmSimulation }
}

export async function generateMetadata({
  params: { simulation },
}: FilmSimulationProps): Promise<Metadata> {
  const [
    photos,
    count,
    dateRange,
  ] = await getPhotosFilmSimulationDataCached({
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

export default async function Share({
  params: { simulation },
  searchParams,
}: FilmSimulationProps & PaginationParams) {
  const {
    photos,
    count,
    dateRange,
    showMorePath,
  } = await getPhotosFilmSimulationDataCachedWithPagination({
    simulation,
    searchParams,
  });

  return <>
    <FilmSimulationShareModal {...{ simulation, photos, count, dateRange }} />
    <FilmSimulationOverview
      {...{ simulation, photos, count, dateRange, showMorePath }}
      animateOnFirstLoadOnly
    />
  </>;
}
