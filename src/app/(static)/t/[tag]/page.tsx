import { getPhotosCached, getPhotosCountTagCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';
import { getUniqueTags } from '@/services/postgres';
import {
  PaginationParams,
  getPaginationForSearchParams,
} from '@/site/pagination';
import { pathForTag } from '@/site/paths';
import { generateMetaForTag } from '@/tag';
import TagHeader from '@/tag/TagHeader';
import { Metadata } from 'next';

interface TagProps {
  params: { tag: string }
}

export async function generateStaticParams() {
  const tags = await getUniqueTags();
  return tags.map(tag => ({
    params: { tag },
  }));
}

export async function generateMetadata({
  params: { tag },
}: TagProps): Promise<Metadata> {
  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ tag, limit: GRID_THUMBNAILS_TO_SHOW_MAX }),
    getPhotosCountTagCached(tag),
  ]);

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForTag(tag, photos, count);

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
  const { offset, limit } = getPaginationForSearchParams(searchParams);

  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ tag, limit }),
    getPhotosCountTagCached(tag),
  ]);

  const showMorePath = count > photos.length
    ? pathForTag(tag, offset + 1)
    : undefined;

  return (
    <SiteGrid
      key="Tag Grid"
      contentMain={<div className="space-y-8 mt-4">
        <TagHeader {...{ tag, photos, count }} />
        <PhotoGrid {...{ photos, tag, showMorePath }} />
      </div>}
    />
  );
}
