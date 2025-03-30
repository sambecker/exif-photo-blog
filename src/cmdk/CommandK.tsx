import CommandKClient from './CommandKClient';
import { getPhotosMetaCached } from '@/photo/cache';
import { photoQuantityText } from '@/photo';
import { ADMIN_DEBUG_TOOLS_ENABLED } from '../app/config';
import { getDataForCategories } from '@/category/data';

export default async function CommandK() {
  const [
    count,
    cameras,
    lenses,
    tags,
    recipes,
    films,
    focalLengths,
  ] = await Promise.all([
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
    ...getDataForCategories(),
  ]);

  return <CommandKClient
    cameras={cameras}
    lenses={lenses}
    tags={tags}
    films={films}
    recipes={recipes}
    focalLengths={focalLengths}
    showDebugTools={ADMIN_DEBUG_TOOLS_ENABLED}
    footer={photoQuantityText(count, false)}
  />;
}
