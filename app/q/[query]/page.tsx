import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { PATH_ROOT } from '@/app/path';
import { generateMetaForQuery } from '@/query/meta';
import QueryOverview from '@/query/QueryOverview';
import { getPhotosQueryDataCached } from '@/query/data';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getAppText } from '@/i18n/state/server';

const getPhotosQueryDataCachedCached = cache((query: string) =>
  getPhotosQueryDataCached({ query, limit: INFINITE_SCROLL_GRID_INITIAL }));

interface QueryProps {
  params: Promise<{ query: string }>
}

export async function generateMetadata({
  params,
}: QueryProps): Promise<Metadata> {
  const { query: queryFromParams } = await params;

  const query = decodeURIComponent(queryFromParams);

  const [
    photos,
    { count },
  ] = await getPhotosQueryDataCachedCached(query);

  if (photos.length === 0) { return {}; }

  const appText = await getAppText();

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForQuery(query, photos, appText, count);

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
    // Results are derived from other pages, so keep them out of search indexes
    robots: { index: false },
  };
}

export default async function QueryPage({
  params,
}: QueryProps) {
  const { query: queryFromParams } = await params;

  const query = decodeURIComponent(queryFromParams);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosQueryDataCachedCached(query);

  if (photos.length === 0) { redirect(PATH_ROOT); }

  return (
    <QueryOverview {...{
      query,
      photos,
      count,
      dateRange,
    }} />
  );
}
