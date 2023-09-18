import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { getPhotos } from '@/services/postgres';
import { absolutePathForTag, absolutePathForTagImage } from '@/site/paths';
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

  const url = absolutePathForTag(tag);
  const titlePage = pageTitleForTag(tag);
  const titleOg = ogTitleForTag(tag);
  const description = descriptionForTaggedPhotos(photos);
  const images = absolutePathForTagImage(tag);

  return {
    title: titlePage,
    openGraph: {
      title: titleOg,
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
  const photos = await getPhotos(undefined, undefined, undefined, tag);

  const dateStart = photos[0].takenAtNaiveFormattedShort;
  const dateEnd = photos[photos.length - 1].takenAtNaiveFormattedShort;

  return (
    <SiteGrid
      contentMain={<div className="space-y-8 mt-4">
        <div className={cc(
          'flex flex-col gap-y-0.5',
          'xs:grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
        )}>
          <PhotoTag tag={tag} />
          <span className={cc(
            'uppercase text-gray-300 dark:text-gray-500',
            'sm:col-span-2 md:col-span-1 lg:col-span-2',
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
