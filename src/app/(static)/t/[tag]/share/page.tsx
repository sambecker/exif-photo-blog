import { getPhotosCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { getUniqueTags } from '@/services/postgres';
import { generateMetaForTag } from '@/tag';
import TagHeader from '@/tag/TagHeader';
import TagShareModal from '@/tag/TagShareModal';
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
  const photos = await getPhotosCached({ tag });

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForTag(tag, photos);

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
  params: { tag },
}: {
  params: { tag: string }
}) {
  const photos = await getPhotosCached({ tag });
  return <>
    <TagShareModal tag={tag} photos={photos} />
    <SiteGrid
      key="Tag Grid"
      contentMain={<div className="space-y-8 mt-4">
        <TagHeader tag={tag} photos={photos} />
        <PhotoGrid photos={photos} tag={tag} animate={false} />
      </div>}
    />
  </>;
}
