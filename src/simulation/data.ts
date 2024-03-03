import {
  getPhotosCached,
  getPhotosFilmSimulationMetaCached,
} from '@/photo/cache';
import {
  PaginationSearchParams,
  getPaginationFromSearchParams,
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
    getPhotosFilmSimulationMetaCached(simulation),
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
  const { offset, limit } = getPaginationFromSearchParams(searchParams);

  const [photos, { count, dateRange }] =
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
