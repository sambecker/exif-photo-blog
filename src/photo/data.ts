import {
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueRecipesCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueRecipes,
  getUniqueTags,
} from '@/photo/db/query';
import { SHOW_FILM_SIMULATIONS, SHOW_RECIPES } from '@/app/config';
import { sortTagsObject } from '@/tag';

export const getPhotoSidebarData = () => [
  getUniqueTags().then(sortTagsObject).catch(() => []),
  getUniqueCameras().catch(() => []),
  SHOW_FILM_SIMULATIONS
    ? getUniqueFilmSimulations().catch(() => [])
    : [],
  SHOW_RECIPES
    ? getUniqueRecipes().catch(() => [])
    : [],
] as const;

export const getPhotoSidebarDataCached = () => [
  getUniqueTagsCached().then(sortTagsObject),
  getUniqueCamerasCached(),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
  SHOW_RECIPES ? getUniqueRecipesCached() : [],
] as const;
