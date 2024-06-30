import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { generateMetaForTag } from '@/tag';
import TagOverview from '@/tag/TagOverview';
import TagShareModal from '@/tag/TagShareModal';
import { getPhotosTagDataCached } from '@/tag/data';
import type { Metadata } from 'next';
import { cache } from 'react';

const getPhotosTagDataCachedCached = cache((tag: string) =>
  getPhotosTagDataCached({ tag, limit: INFINITE_SCROLL_GRID_INITIAL }));

interface TagProps {
  params: { tag: string }
}

export async function generateMetadata({
  params: { tag: tagFromParams },
}: TagProps): Promise<Metadata> {
  const tag = decodeURIComponent(tagFromParams);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosTagDataCachedCached(tag);

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForTag(tag, photos, count, dateRange);

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

export default async function Share({
  params: { tag: tagFromParams },
}: TagProps) {
  const tag = decodeURIComponent(tagFromParams);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosTagDataCachedCached(tag);

  return <>
    <TagShareModal {...{ tag, photos, count, dateRange }} />
    <TagOverview
      {...{ tag, photos, count, dateRange }}
      animateOnFirstLoadOnly
    />
  </>;
}
