import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import { PaginationParams } from '@/site/pagination';
import { generateMetaForTag } from '@/tag';
import TagOverview from '@/tag/TagOverview';
import {
  getPhotosTagDataCached,
  getPhotosTagDataCachedWithPagination,
} from '@/tag/data';
import { Metadata } from 'next';

interface TagProps {
  params: { tag: string }
}

export async function generateMetadata({
  params: { tag },
}: TagProps): Promise<Metadata> {
  const [
    photos,
    count,
    dateRange,
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
  params: { tag },
  searchParams,
}:TagProps & PaginationParams) {
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
