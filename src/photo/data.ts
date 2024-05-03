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
} from '@/photo/db';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';
import { sortTagsObject } from '@/tag';

export const getPhotoSidebarData = () => [
  getPhotosCount().catch(() => 0),
  getUniqueTags().then(sortTagsObject).catch(() => []),
  getUniqueCameras().catch(() => []),
  SHOW_FILM_SIMULATIONS
    ? getUniqueFilmSimulations().catch(() => [])
    : [],
] as const;

export const getPhotoSidebarDataCached = () => [
  getPhotosCountCached(),
  getUniqueTagsCached().then(sortTagsObject),
  getUniqueCamerasCached(),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
] as const;
