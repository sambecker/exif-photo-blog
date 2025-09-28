import { generateMetaForFocalLength, getFocalLengthFromString } from '@/focal';
import FocalLengthOverview from '@/focal/FocalLengthOverview';
import { getPhotosFocalLengthDataCached } from '@/focal/data';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getUniqueFocalLengths } from '@/photo/query';
import { PATH_ROOT } from '@/app/path';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { getAppText } from '@/i18n/state/server';

const getPhotosFocalDataCachedCached = cache((focal: number) =>
  getPhotosFocalLengthDataCached({
    focal,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  }));

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'focal-lengths',
  'page',
  getUniqueFocalLengths,
  focalLengths => focalLengths
    .map(({ focal }) => ({ focal: focal.toString() })),
);

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

  const appText = await getAppText();

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForFocalLength(focal, photos, appText, count, dateRange);

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
