import {
  ogImageDescriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { absolutePathForPhoto, absolutePathForPhotoImage } from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotoCached, getPhotosCached } from '@/cache';

export const runtime = 'edge';

export async function generateMetadata({
  params: { photoId, tag },
}: {
  params: { photoId: string, tag: string }
}): Promise<Metadata> {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = ogImageDescriptionForPhoto(photo);
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
}: {
  params: { photoId: string, tag: string }
  children: React.ReactNode
}) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { redirect('/'); }

  const photos = await getPhotosCached({ tag });

  return <>
    {children}
    <PhotoDetailPage
      photo={photo}
      photos={photos}
      tag={tag}
    />
  </>;
}
