import AnimateItems from '@/components/AnimateItems';
import Note from '@/components/Note';
import AppGrid from '@/components/AppGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { getPhotosMetaCached, getPhotosNoStore } from '@/photo/cache';
import { absolutePathForTag } from '@/app/paths';
import { TAG_HIDDEN, descriptionForTaggedPhotos, titleForTag } from '@/tag';
import HiddenHeader from '@/tag/HiddenHeader';
import { Metadata } from 'next';
import { cache } from 'react';
import { getAppText } from '@/i18n/state/server';

const getPhotosHiddenMetaCached = cache(() =>
  getPhotosMetaCached({ hidden: 'only' }));

export async function generateMetadata(): Promise<Metadata> {
  const { count, dateRange } = await getPhotosHiddenMetaCached();

  if (count === 0) { return {}; }

  const appText = await getAppText();
  
  const title = titleForTag(TAG_HIDDEN, undefined, appText, count);

  const description = descriptionForTaggedPhotos(
    undefined,
    appText,
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
    <AppGrid
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
