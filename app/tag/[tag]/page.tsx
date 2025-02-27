import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getUniqueTags } from '@/photo/db/query';
import { IS_PRODUCTION } from '@/app/config';
import { STATICALLY_OPTIMIZED_PHOTO_CATEGORIES } from '@/app/config';
import { PATH_ROOT } from '@/app/paths';
import { generateMetaForTag } from '@/tag';
import TagOverview from '@/tag/TagOverview';
import { getPhotosTagDataCached } from '@/tag/data';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const getPhotosTagDataCachedCached = cache((tag: string) =>
  getPhotosTagDataCached({ tag, limit: INFINITE_SCROLL_GRID_INITIAL}));

export let generateStaticParams:
  (() => Promise<{ tag: string }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORIES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const tags = await getUniqueTags();
    return tags.map(({ tag }) => ({ tag }));
  };
}

interface TagProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({
  params,
}: TagProps): Promise<Metadata> {
  const { tag: tagFromParams } = await params;

  const tag = decodeURIComponent(tagFromParams);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosTagDataCachedCached(tag);

  if (photos.length === 0) { return {}; }

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

export default async function TagPage({
  params,
}:TagProps) {
  const { tag: tagFromParams } = await params;

  const tag = decodeURIComponent(tagFromParams);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosTagDataCachedCached(tag);

  if (photos.length === 0) { redirect(PATH_ROOT); }

  return (
    <TagOverview {...{ tag, photos, count, dateRange }} />
  );
}
