import CommandKClient from './CommandKClient';
import { photoQuantityText } from '@/photo';
import { getAppText } from '@/i18n/state/server';
import { Suspense } from 'react';
import { getDataForCategories } from '@/category/data';
import { getPhotosMeta } from '@/photo/query';
import { cacheTagGlobal } from '@/cache';

export default async function CommandK() {
  'use cache';
  cacheTagGlobal();

  const [
    count,
    categories,
  ] = await Promise.all([
    getPhotosMeta()
      .then(({ count }) => count)
      .catch(() => 0),
    getDataForCategories(),
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
