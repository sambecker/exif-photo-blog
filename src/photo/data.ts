import {
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  getPhotosCount,
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueTags,
} from '@/services/vercel-postgres';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';
import { sortTagsObject } from '@/tag';

export const getPhotoSidebarData = () => [
  getPhotosCount(),
  getUniqueTags().then(sortTagsObject),
  getUniqueCameras(),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulations() : [],
] as const;

export const getPhotoSidebarDataCached = () => [
  getPhotosCountCached(),
  getUniqueTagsCached().then(sortTagsObject),
  getUniqueCamerasCached(),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
] as const;
