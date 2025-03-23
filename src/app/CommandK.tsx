import CommandKClient from '@/components/cmdk/CommandKClient';
import {
  getPhotosMetaCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueLensesCached,
  getUniqueRecipesCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import { photoQuantityText } from '@/photo';
import {
  ADMIN_DEBUG_TOOLS_ENABLED,
  SHOW_FILM_SIMULATIONS,
  SHOW_RECIPES,
} from './config';
import { getUniqueFocalLengths } from '@/photo/db/query';
import { sortCategoryByCount } from '@/category';

export default async function CommandK() {
  const [
    count,
    cameras,
    lenses,
    tags,
    recipes,
    filmSimulations,
    focalLengths,
  ] = await Promise.all([
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
    getUniqueCamerasCached().catch(() => []),
    getUniqueLensesCached().catch(() => []),
    getUniqueTagsCached().catch(() => []),
    SHOW_RECIPES
      ? getUniqueRecipesCached().catch(() => [])
      : [],
    SHOW_FILM_SIMULATIONS
      ? getUniqueFilmSimulationsCached().catch(() => [])
      : [],
    getUniqueFocalLengths().catch(() => []),
  ]);

  return <CommandKClient
    cameras={cameras.sort(sortCategoryByCount)}
    lenses={lenses.sort(sortCategoryByCount)}
    tags={tags.sort(sortCategoryByCount)}
    simulations={filmSimulations.sort(sortCategoryByCount)}
    recipes={recipes.sort(sortCategoryByCount)}
    focalLengths={focalLengths.sort(sortCategoryByCount)}
    showDebugTools={ADMIN_DEBUG_TOOLS_ENABLED}
    footer={photoQuantityText(count, false)}
  />;
}
