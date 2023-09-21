import { getPhotosCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { absolutePathForTag, absolutePathForTagImage } from '@/site/paths';
import { descriptionForTaggedPhotos, titleForTag } from '@/tag';
import TagHeader from '@/tag/TagHeader';
import { Metadata } from 'next';

interface TagProps {
  params: { tag: string }
}

export async function generateMetadata({
  params: { tag },
}: TagProps): Promise<Metadata> {
  const photos = await getPhotosCached({ tag });

  const url = absolutePathForTag(tag);
  const title = titleForTag(tag, photos);
  const description = descriptionForTaggedPhotos(photos, true);
  const images = absolutePathForTagImage(tag);

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

export default async function TagPage({ params: { tag } }: TagProps) {
  const photos = await getPhotosCached({ tag });

  return (
    <SiteGrid
      contentMain={<div className="space-y-8 mt-4">
        <TagHeader tag={tag} photos={photos} />
        <PhotoGrid photos={photos} tag={tag} />
      </div>}
    />
  );
}
