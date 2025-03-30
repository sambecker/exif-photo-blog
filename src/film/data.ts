import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';
import { FilmSimulation } from '.';

export const getPhotosFilmDataCached = ({
  film,
  limit,
}: {
  film: FilmSimulation,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ film, limit }),
    getPhotosMetaCached({ film }),
  ]);
