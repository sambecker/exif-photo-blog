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
import { getPhotoCached, getPhotosCached } from '@/cache';
import { getPhotos, getUniqueDevices } from '@/services/postgres';
import { deviceFromPhoto } from '@/device';

export async function generateStaticParams() {
  const params: { params: { photoId: string, device: string }}[] = [];

  const devices = await getUniqueDevices();
  devices.forEach(async ({ deviceKey, device }) => {
    const photos = await getPhotos({ device });
    params.push(...photos.map(photo => ({
      params: { photoId: photo.id, device: deviceKey },
    })));
  });

  return params;
}

export async function generateMetadata({
  params: { photoId },
}: {
  params: { photoId: string, device: string }
}): Promise<Metadata> {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto(photo, undefined, deviceFromPhoto(photo));

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

export default async function PhotoDevicePage({
  params: { photoId },
  children,
}: {
  params: { photoId: string, tag: string }
  children: React.ReactNode
}) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { redirect(PATH_ROOT); }

  const device = deviceFromPhoto(photo);

  const photos = await getPhotosCached({ device });

  return <>
    {children}
    <PhotoDetailPage
      photo={photo}
      photos={photos}
      device={device}
    />
  </>;
}
