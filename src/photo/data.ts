import {
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueLensesCached,
  getUniqueRecipesCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueLenses,
  getUniqueRecipes,
  getUniqueTags,
} from '@/photo/db/query';
import { SHOW_FILM_SIMULATIONS, SHOW_LENSES, SHOW_RECIPES } from '@/app/config';
import { sortTagsObject } from '@/tag';

export const getPhotoSidebarData = () => [
  getUniqueCameras().catch(() => []),
  SHOW_LENSES ? getUniqueLenses().catch(() => []) : [],
  getUniqueTags().then(sortTagsObject).catch(() => []),
  SHOW_FILM_SIMULATIONS
    ? getUniqueFilmSimulations().catch(() => [])
    : [],
  SHOW_RECIPES
    ? getUniqueRecipes().catch(() => [])
    : [],
] as const;

export const getPhotoSidebarDataCached = () => [
  getUniqueCamerasCached(),
  SHOW_LENSES ? getUniqueLensesCached() : [],
  getUniqueTagsCached().then(sortTagsObject),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
  SHOW_RECIPES ? getUniqueRecipesCached() : [],
] as const;
