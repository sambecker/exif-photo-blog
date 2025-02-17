import { generateMetaForFocalLength, getFocalLengthFromString } from '@/focal';
import FocalLengthOverview from '@/focal/FocalLengthOverview';
import { getPhotosFocalLengthDataCached } from '@/focal/data';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { IS_PRODUCTION } from '@/app/config';
import { getUniqueFocalLengths } from '@/photo/db/query';
import { STATICALLY_OPTIMIZED_PHOTO_CATEGORIES } from '@/app/config';
import { PATH_ROOT } from '@/app/paths';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const getPhotosFocalDataCachedCached = cache((focal: number) =>
  getPhotosFocalLengthDataCached({
    focal,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  }));

export let generateStaticParams:
  (() => Promise<{ focal: string }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORIES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const focalLengths = await getUniqueFocalLengths();
    return focalLengths.map(({ focal }) => ({ focal: focal.toString() }));
  };
}

interface FocalLengthProps {
  params: Promise<{ focal: string }>
}

export async function generateMetadata({
  params,
}: FocalLengthProps): Promise<Metadata> {
  const { focal: focalString } = await params;

  const focal = getFocalLengthFromString(focalString);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosFocalDataCachedCached(focal);

  if (photos.length === 0) { return {}; }

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForFocalLength(focal, photos, count, dateRange);

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

export default async function TagPage({
  params,
}:FocalLengthProps) {
  const { focal: focalString } = await params;

  const focal = getFocalLengthFromString(focalString);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosFocalDataCachedCached(focal);

  if (photos.length === 0) { redirect(PATH_ROOT); }

  return (
    <FocalLengthOverview {...{ focal, photos, count, dateRange }} />
  );
}
