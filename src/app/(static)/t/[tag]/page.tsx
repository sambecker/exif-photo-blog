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
import { cc } from '@/utility/css';
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

  const dateStart = photos[0].takenAtNaiveFormattedShort;
  const dateEnd = photos[photos.length - 1].takenAtNaiveFormattedShort;

  return (
    <SiteGrid
      contentMain={<div className="space-y-8 mt-4">
        <div className={cc(
          'flex gap-2 sm:gap-0',
          'sm:grid sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
        )}>
          <PhotoTag tag={tag} />
          <span className={cc(
            'uppercase text-gray-300 dark:text-gray-500',
            'col-span-2 md:col-span-1 lg:col-span-2',
          )}>
            {descriptionForTaggedPhotos(photos)}
          </span>
          <span className={cc(
            'hidden sm:inline-block',
            'text-right uppercase',
            'text-gray-400 dark:text-gray-500',
          )}>
            {dateStart === dateEnd
              ? dateStart
              : <>{dateStart}<br />– {dateEnd}</>}
          </span>
        </div>
        <PhotoGrid photos={photos} />
      </div>}
    />
  );
}
