import {
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { absolutePathForPhoto, absolutePathForPhotoImage } from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotoCached, getPhotosCached } from '@/cache';
import { getPhotos, getUniqueTags } from '@/services/postgres';

export async function generateStaticParams() {
  const params: { params: { photoId: string, tag: string }}[] = [];

  const tags = await getUniqueTags();
  tags.forEach(async tag => {
    const photos = await getPhotos({ tag });
    params.push(...photos.map(photo => ({
      params: { photoId: photo.id, tag },
    })));
  });

  return params;
}

export async function generateMetadata({
  params: { photoId, tag },
}: {
  params: { photoId: string, tag: string }
}): Promise<Metadata> {
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
