import {
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  PATH_ROOT,
  absolutePathForPhoto,
  absolutePathForPhotoImage,
} from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotoCached } from '@/cache';
import { getPhotos, getUniqueTags } from '@/services/postgres';
import { getPhotosTagDataCached } from '@/tag/data';
import { ReactNode } from 'react';

interface PhotoTagProps {
  params: { photoId: string, tag: string }
}

export async function generateStaticParams() {
  const params: PhotoTagProps[] = [];

  const tags = await getUniqueTags();
  tags.forEach(async ({ tag }) => {
    const photos = await getPhotos({ tag });
    params.push(...photos.map(photo => ({
      params: { photoId: photo.id, tag },
    })));
  });

  return params;
}

export async function generateMetadata({
  params: { photoId, tag },
}: PhotoTagProps): Promise<Metadata> {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto(photo, tag);

  return {
    title,
    description,
    openGraph: {
      title,
      images,
      description,
      url,
    },
    twitter: {
      title,
      description,
      images,
      card: 'summary_large_image',
    },
  };
}

export default async function PhotoTagPage({
  params: { photoId, tag },
  children,
}: PhotoTagProps & { children: ReactNode }) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { redirect(PATH_ROOT); }

  const [
    photos,
    count,
    dateRange,
  ] = await getPhotosTagDataCached({ tag });

  return <>
    {children}
    <PhotoDetailPage {...{ photo, photos, tag, count, dateRange }} />
  </>;
}
