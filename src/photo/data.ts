import {
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';
import { TAG_FAVS } from '@/tag';

export const getPhotoSidebarDataCached = () => [
  getPhotosCountCached(),
  getUniqueTagsCached().then(tags =>
    tags.filter(({ tag }) => tag === TAG_FAVS).concat(
      tags.filter(({ tag }) => tag !== TAG_FAVS))),
  getUniqueCamerasCached(),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
] as const;
