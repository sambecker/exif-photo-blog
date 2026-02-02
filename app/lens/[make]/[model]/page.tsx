'use cache';

import { Metadata } from 'next/types';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { cache } from 'react';
import { getUniqueLenses } from '@/photo/query';
import { generateMetaForLens } from '@/lens/meta';
import { getPhotosLensData } from '@/lens/data';
import LensOverview from '@/lens/LensOverview';
import {
  getLensFromParams,
  LensProps,
  safelyGenerateLensStaticParams,
} from '@/lens';
import {
  staticallyGenerateCategoryIfConfigured,
} from '@/app/static';
import { getAppText } from '@/i18n/state/server';
import { PATH_ROOT } from '@/app/path';
import { redirect } from 'next/navigation';
import { cacheTagGlobal } from '@/cache';

const getPhotosLensDataCached = cache((
  make: string | undefined,
  model: string,
) => getPhotosLensData(
  make,
  model,
  INFINITE_SCROLL_GRID_INITIAL,
));

export const generateStaticParams = async () =>
  staticallyGenerateCategoryIfConfigured(
    'lenses',
    'page',
    getUniqueLenses,
    safelyGenerateLensStaticParams,
  );

export async function generateMetadata({
  params,
}: LensProps): Promise<Metadata> {
  const { make, model } = await getLensFromParams(params);

  const [
    photos,
    { count, dateRange },
    lens,
  ] = await getPhotosLensDataCached(make, model);

  const appText = await getAppText();

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForLens(lens, photos, appText, count, dateRange);

  return {
    title,
    openGraph: {
      title,
      description,
      images,
      url,
    },
    twitter: {
      images,
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function LensPage({
  params,
}: LensProps) {
  cacheTagGlobal();

  const { make, model } = await getLensFromParams(params);

  const [
    photos,
    { count, dateRange },
    lens,
  ] = await getPhotosLensDataCached(make, model);

  if (photos.length === 0) { redirect(PATH_ROOT); }

  return (
    <LensOverview {...{ lens, photos, count, dateRange }} />
  );
}
