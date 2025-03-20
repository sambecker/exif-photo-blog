import {
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueFocalLengthsCached,
  getUniqueLensesCached,
  getUniqueRecipesCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import {
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueFocalLengths,
  getUniqueLenses,
  getUniqueRecipes,
  getUniqueTags,
} from '@/photo/db/query';
import {
  SHOW_FILM_SIMULATIONS,
  SHOW_FOCAL_LENGTHS,
  SHOW_LENSES,
  SHOW_RECIPES,
} from '@/app/config';
import { sortTagsObject } from '@/tag';

export const getPhotoSidebarData = () => [
  getUniqueCameras().catch(() => []),
  SHOW_LENSES ? getUniqueLenses().catch(() => []) : [],
  getUniqueTags().then(sortTagsObject).catch(() => []),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulations().catch(() => []) : [],
  SHOW_RECIPES ? getUniqueRecipes().catch(() => []) : [],
  SHOW_FOCAL_LENGTHS ? getUniqueFocalLengths().catch(() => []) : [],
] as const;

export const getPhotoSidebarDataCached = () => [
  getUniqueCamerasCached(),
  SHOW_LENSES ? getUniqueLensesCached() : [],
  getUniqueTagsCached().then(sortTagsObject),
  SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
  SHOW_RECIPES ? getUniqueRecipesCached() : [],
  SHOW_FOCAL_LENGTHS ? getUniqueFocalLengthsCached() : [],
] as const;
