import {
  getPhotosMetaCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueTags,
} from '@/photo/db/query';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';
import { sortTagsObject } from '@/tag';

export const getPhotoSidebarData = () => [
  getPhotosMeta()
    .then(({ count }) => count)
    .catch(() => 0),
  getUniqueTags().then(sortTagsObject).catch(() => []),
  getUniqueCameras().catch(() => []),
  SHOW_FILM_SIMULATIONS
    ? getUniqueFilmSimulations().catch(() => [])
    : [],
] as const;

export const getPhotoSidebarDataCached = () => [
  getPhotosMetaCached()
    .then(({ count }) => count)
    .catch(() => 0),
  getUniqueTagsCached().then(sortTagsObject),
  getUniqueCamerasCached(),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
] as const;
