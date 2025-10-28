'use cache';

import CommandKClient from './CommandKClient';
import { photoQuantityText } from '@/photo';
import { getDataForCategoriesCached } from '@/category/cache';
import { getAppText } from '@/i18n/state/server';
import { getPhotosMeta } from '@/photo/query';

export default async function CommandK() {
  const [
    count,
    categories,
  ] = await Promise.all([
    getPhotosMeta()
      .then(({ count }) => count)
      .catch(() => 0),
    getDataForCategoriesCached(),
  ]);

  const appText = await getAppText();

  return (
    <CommandKClient
      {...categories}
      footer={photoQuantityText(count, appText, false)}
    />
  );
}
