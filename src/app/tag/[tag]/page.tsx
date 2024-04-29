import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import { PaginationParams } from '@/site/pagination';
import { generateMetaForTag } from '@/tag';
import TagOverview from '@/tag/TagOverview';
import {
  getPhotosTagDataCached,
  getPhotosTagDataCachedWithPagination,
} from '@/tag/data';
import type { Metadata } from 'next';

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
  ] = await getPhotosTagDataCached({
    tag,
    limit: GRID_THUMBNAILS_TO_SHOW_MAX,
  });

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
  params: { tag: tagFromParams },
  searchParams,
}:TagProps & PaginationParams) {
  const tag = decodeURIComponent(tagFromParams);

  const {
    photos,
    count,
    showMorePath,
    dateRange,
  } = await getPhotosTagDataCachedWithPagination({
    tag,
    searchParams,
  });

  return (
    <TagOverview {...{ tag, photos, count, dateRange, showMorePath }} />
  );
}
