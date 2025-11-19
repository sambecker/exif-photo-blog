import CommandKClient from './CommandKClient';
import { getPhotosMetaCached } from '@/photo/cache';
import { photoQuantityText } from '@/photo';
import { getDataForCategoriesCached } from '@/category/cache';
import { getAppText } from '@/i18n/state/server';
import { Suspense } from 'react';

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
    <Suspense>
      {/* Due to client-side date handling */}
      <CommandKClient
        {...categories}
        footer={photoQuantityText(count, appText, false)}
      />
    </Suspense>
  );
}
