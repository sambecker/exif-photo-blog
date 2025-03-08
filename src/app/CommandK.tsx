import CommandKClient from '@/components/cmdk/CommandKClient';
import {
  getPhotosMetaCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
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
    tags,
    cameras,
    recipes,
    filmSimulations,
    focalLengths,
  ] = await Promise.all([
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
    getUniqueTagsCached().catch(() => []),
    getUniqueCamerasCached().catch(() => []),
    SHOW_RECIPES
      ? getUniqueRecipesCached().catch(() => [])
      : [],
    SHOW_FILM_SIMULATIONS
      ? getUniqueFilmSimulationsCached().catch(() => [])
      : [],
    getUniqueFocalLengths().catch(() => []),
  ]);

  return <CommandKClient
    tags={tags}
    cameras={cameras}
    simulations={filmSimulations}
    recipes={recipes}
    focalLengths={focalLengths}
    showDebugTools={ADMIN_DEBUG_TOOLS_ENABLED}
    footer={photoQuantityText(count, false)}
  />;
}
