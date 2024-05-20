import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';
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
    getPhotosMetaCached({ simulation }),
  ]);
