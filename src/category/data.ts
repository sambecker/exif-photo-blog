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
import { sortTagsByCount } from '@/tag';
import { sortCategoriesByCount } from '@/category';

export const getDataForCategories = () => [
  getUniqueCameras()
    .then(sortCategoriesByCount)
    .catch(() => []),
  SHOW_LENSES
    ? getUniqueLenses()
      .then(sortCategoriesByCount)
      .catch(() => [])
    : [],
  getUniqueTags()
    .then(sortTagsByCount)
    .catch(() => []),
  SHOW_RECIPES
    ? getUniqueRecipes()
      .then(sortCategoriesByCount)
      .catch(() => [])
    : [],
  SHOW_FILM_SIMULATIONS
    ? getUniqueFilmSimulations()
      .then(sortCategoriesByCount)
      .catch(() => [])
    : [],
  SHOW_FOCAL_LENGTHS
    ? getUniqueFocalLengths()
      .then(sortCategoriesByCount)
      .catch(() => [])
    : [],
] as const;
