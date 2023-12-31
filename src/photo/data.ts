import {
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/cache';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';
import { TAG_FAVS, Tags } from '@/tag';

export const getPhotoSidebarDataCached = () => [
  getPhotosCountCached(),
  getUniqueTagsCached().then(tags =>
    ([tags.find(({ tag }) => tag === TAG_FAVS) ?? []] as Tags)
      .concat(tags.filter(({ tag }) => tag !== TAG_FAVS))),
  getUniqueCamerasCached(),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
] as const;
