import AnimateItems from '@/components/AnimateItems';
import Note from '@/components/Note';
import AppGrid from '@/components/AppGrid';
import PhotoGrid from '@/photo/PhotoGrid';
import { absolutePathForTag } from '@/app/path';
import { TAG_PRIVATE, descriptionForTaggedPhotos, titleForTag } from '@/tag';
import PrivateHeader from '@/tag/PrivateHeader';
import { Metadata } from 'next';
import { cache } from 'react';
import { getAppText } from '@/i18n/state/server';
import { getPhotos, getPhotosMeta } from '@/photo/query';

const getPhotosHiddenMetaCached = cache(() =>
  getPhotosMeta({ hidden: 'only' }));

export async function generateMetadata(): Promise<Metadata> {
  const { count, dateRange } = await getPhotosHiddenMetaCached();

  if (count === 0) { return {}; }

  const appText = await getAppText();
  
  const title = titleForTag(TAG_PRIVATE, undefined, appText, count);

  const description = descriptionForTaggedPhotos(
    undefined,
    appText,
    undefined,
    count,
    dateRange,
  );
  const url = absolutePathForTag(TAG_PRIVATE);

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

export default async function PrivateTagPage() {
  const [
    photos,
    { count, dateRange },
  ] = await Promise.all([
    getPhotos({ hidden: 'only' }),
    getPhotosHiddenMetaCached(),
  ]);

  return (
    <AppGrid
      contentMain={<div className="space-y-4 mt-4">
        <AnimateItems
          type="bottom"
          items={[<PrivateHeader
            key="PrivateHeader"
            {...{ photos, count, dateRange }}
          />]}
          animateOnFirstLoadOnly
        />
        <div className="space-y-6">
          <Note animate>
            Visible only to admins (uploads only secure via obscurity)
          </Note>
          <PhotoGrid {...{ photos }} />
        </div>
      </div>}
    />
  );
}
