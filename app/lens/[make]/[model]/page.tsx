import { Metadata } from 'next/types';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { cache } from 'react';
import { STATICALLY_OPTIMIZED_PHOTO_CATEGORIES } from '@/app/config';
import { IS_PRODUCTION } from '@/app/config';
import { getUniqueLenses } from '@/photo/db/query';
import { generateMetaForLens } from '@/lens/meta';
import { getPhotosLensDataCached } from '@/lens/data';
import LensOverview from '@/lens/LensOverview';
import { LensProps } from '@/lens';

const getPhotosLensDataCachedCached = cache((
  make: string,
  model: string,
) => getPhotosLensDataCached(
  make,
  model,
  INFINITE_SCROLL_GRID_INITIAL,
));

export let generateStaticParams:
  (() => Promise<{ make: string, model: string }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORIES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const lenses = await getUniqueLenses();
    return lenses.map(({ lens: { make, model } }) => ({ make, model }));
  };
}

export async function generateMetadata({
  params,
}: LensProps): Promise<Metadata> {
  const { make, model } = await params;

  const [
    photos,
    { count, dateRange },
    lens,
  ] = await getPhotosLensDataCachedCached(make, model);

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForLens(lens, photos, count, dateRange);

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
  const { make, model } = await params;

  const [
    photos,
    { count, dateRange },
    lens,
  ] = await getPhotosLensDataCachedCached(make, model);

  return (
    <LensOverview {...{ lens, photos, count, dateRange }} />
  );
}
