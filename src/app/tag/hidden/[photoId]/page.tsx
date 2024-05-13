import { descriptionForPhoto, titleForPhoto } from '@/photo';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotoCached, getPhotosCached } from '@/photo/cache';
import { PATH_ROOT, absolutePathForPhoto } from '@/site/paths';
import { TAG_HIDDEN } from '@/tag';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';

const getPhotoCachedCached = cache(getPhotoCached);

interface PhotoTagProps {
  params: { photoId: string }
}

export async function generateMetadata({
  params: { photoId },
}: PhotoTagProps): Promise<Metadata> {
  const photo = await getPhotoCachedCached(photoId, true);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const url = absolutePathForPhoto(photo, TAG_HIDDEN);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
  };
}

export default async function PhotoTagHiddenPage({
  params: { photoId },
}: PhotoTagProps) {
  const photo = await getPhotoCachedCached(photoId, true);

  if (!photo) { redirect(PATH_ROOT); }

  const photos = await getPhotosCached({ hidden: 'only' });
  const count = photos.length;

  return (
    <PhotoDetailPage {...{ photo, photos, count, tag: TAG_HIDDEN }} />
  );
}
