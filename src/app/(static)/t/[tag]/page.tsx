import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { getPhotos } from '@/services/postgres';
import { absolutePathForTagImage } from '@/site/paths';
import {
  descriptionForTaggedPhotos,
  ogTitleForTag,
  pageTitleForTag,
} from '@/tag';
import PhotoTag from '@/tag/PhotoTag';
import { Metadata } from 'next';

interface TagProps {
  params: { tag: string }
}

export async function generateMetadata({
  params: { tag },
}: TagProps): Promise<Metadata> {
  const photos = await getPhotos(undefined, undefined, undefined, tag);
  return {
    title: pageTitleForTag(tag),
    openGraph: {
      title: ogTitleForTag(tag),
      images: absolutePathForTagImage(tag),
    },
    twitter: {
      card: 'summary_large_image',
      images: absolutePathForTagImage(tag),
    },
    description: descriptionForTaggedPhotos(photos),
  };
}

export default async function TagPage({ params: { tag } }: TagProps) {
  const photos = await getPhotos(undefined, undefined, undefined, tag);

  return (
    <SiteGrid
      contentMain={<div className="space-y-8 mt-4">
        <div className="flex items-center gap-2">
          <PhotoTag tag={tag} />
          <span className="uppercase text-gray-400 dark:text-gray-500">
            {descriptionForTaggedPhotos(photos)}
          </span>
        </div>
        <PhotoGrid photos={photos} />
      </div>}
    />
  );
}
