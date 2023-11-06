import {
  getPhotosCached,
  getPhotosFilmSimulationCountCached,
  getPhotosFilmSimulationDateRangeCached,
} from '@/cache';
import {
  PaginationSearchParams,
  getPaginationForSearchParams,
} from '@/site/pagination';
import { pathForFilmSimulation } from '@/site/paths';
import { FilmSimulation } from '.';

export const getPhotosFilmSimulationDataCached = ({
  simulation,
  limit,
}: {
  simulation: FilmSimulation,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ simulation, limit }),
    getPhotosFilmSimulationCountCached(simulation),
    getPhotosFilmSimulationDateRangeCached(simulation),
  ]);

export const getPhotosFilmSimulationDataCachedWithPagination = async ({
  simulation,
  limit: limitProp,
  searchParams,
}: {
  simulation: FilmSimulation,
  limit?: number,
  searchParams?: PaginationSearchParams,
}) => {
  const { offset, limit } = getPaginationForSearchParams(searchParams);

  const [photos, count, dateRange] =
    await getPhotosFilmSimulationDataCached({
      simulation,
      limit: limitProp ?? limit,
    });

  const showMorePath = count > photos.length
    ? pathForFilmSimulation(simulation, offset + 1)
    : undefined;

  return {
    photos,
    count,
    dateRange,
    showMorePath,
  };
};
