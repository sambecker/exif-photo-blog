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
    getPhotosCached({ film: simulation, limit }),
    getPhotosMetaCached({ film: simulation }),
  ]);
