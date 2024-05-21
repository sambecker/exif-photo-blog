import { generateMetaForFocalLength, getFocalLengthFromString } from '@/focal';
import FocalLengthOverview from '@/focal/FocalLengthOverview';
import { getPhotosFocalLengthDataCached } from '@/focal/data';
import { INFINITE_SCROLL_GRID_PHOTO_INITIAL } from '@/photo';
import { PATH_ROOT } from '@/site/paths';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const getPhotosFocalDataCachedCached = cache((focal: number) =>
  getPhotosFocalLengthDataCached({
    focal,
    limit: INFINITE_SCROLL_GRID_PHOTO_INITIAL,
  }));

interface FocalLengthProps {
  params: { focal: string }
}

export async function generateMetadata({
  params: { focal: focalString },
}: FocalLengthProps): Promise<Metadata> {
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
  params: { focal: focalString },
}:FocalLengthProps) {
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
