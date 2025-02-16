import AnimateItems from '@/components/AnimateItems';
import Note from '@/components/Note';
import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { getPhotosNoStore } from '@/photo/cache';
import { getPhotosMeta } from '@/photo/db/query';
import { absolutePathForTag } from '@/app-core/paths';
import { TAG_HIDDEN, descriptionForTaggedPhotos, titleForTag } from '@/tag';
import HiddenHeader from '@/tag/HiddenHeader';
import { Metadata } from 'next';
import { cache } from 'react';

const getPhotosHiddenMetaCached = cache(() =>
  getPhotosMeta({ hidden: 'only' }));

export async function generateMetadata(): Promise<Metadata> {
  const { count, dateRange } = await getPhotosHiddenMetaCached();

  if (count === 0) { return {}; }

  const title = titleForTag(TAG_HIDDEN, undefined, count);
  const description = descriptionForTaggedPhotos(
    undefined,
    undefined,
    count,
    dateRange,
  );
  const url = absolutePathForTag(TAG_HIDDEN);

  return {
    title,
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function HiddenTagPage() {
  const [
    photos,
    { count, dateRange },
  ] = await Promise.all([
    getPhotosNoStore({ hidden: 'only' }),
    getPhotosHiddenMetaCached(),
  ]);

  return (
    <SiteGrid
      contentMain={<div className="space-y-4 mt-4">
        <AnimateItems
          type="bottom"
          items={[<HiddenHeader
            key="HiddenHeader"
            {...{ photos, count, dateRange }}
          />]}
          animateOnFirstLoadOnly
        />
        <div className="space-y-6">
          <Note animate>
            Only visible to authenticated admins
          </Note>
          <PhotoGrid {...{ photos }} />
        </div>
      </div>}
    />
  );
}
