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
    cameras={cameras}
    lenses={lenses}
    tags={tags}
    simulations={filmSimulations}
    recipes={recipes}
    focalLengths={focalLengths}
    showDebugTools={ADMIN_DEBUG_TOOLS_ENABLED}
    footer={photoQuantityText(count, false)}
  />;
}
