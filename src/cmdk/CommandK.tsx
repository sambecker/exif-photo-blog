import CommandKClient from './CommandKClient';
import { getPhotosMetaCached } from '@/photo/cache';
import { photoQuantityText } from '@/photo';
import { ADMIN_DEBUG_TOOLS_ENABLED } from '../app/config';
import { getDataForCategoriesCached } from '@/category/cache';
import { getAppText } from '@/i18n/state/server';

export default async function CommandK() {
  const [
    count,
    categories,
  ] = await Promise.all([
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
    getDataForCategoriesCached(),
  ]);

  const appText = await getAppText();

  return (
    <CommandKClient
      {...categories}
      showDebugTools={ADMIN_DEBUG_TOOLS_ENABLED}
      footer={photoQuantityText(count, appText, false)}
    />
  );
}
