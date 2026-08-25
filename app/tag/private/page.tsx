import Note from '@/components/Note';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getPhotosMetaCached, getPhotosNoStore } from '@/photo/cache';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';
import { absolutePathForTag } from '@/app/path';
import { TAG_PRIVATE, descriptionForTaggedPhotos, titleForTag } from '@/tag';
import PrivateHeader from '@/tag/PrivateHeader';
import { Metadata } from 'next';
import { cache } from 'react';
import { getAppText } from '@/i18n/state/server';

const getPhotosHiddenMetaCached = cache(() =>
  getPhotosMetaCached({ hidden: 'only' }));

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
    getPhotosNoStore({ hidden: 'only', limit: INFINITE_SCROLL_GRID_INITIAL }),
    getPhotosHiddenMetaCached(),
  ]);

  return (
    <PhotoGridHybridContainer
      cacheKey={`tag-${TAG_PRIVATE}`}
      photos={photos}
      count={count}
      tag={TAG_PRIVATE}
      header={<div className="space-y-6">
        <PrivateHeader {...{ photos, count, dateRange }} />
        <Note>
          Visible only to admins (uploads only secure via obscurity)
        </Note>
      </div>}
    />
  );
}
