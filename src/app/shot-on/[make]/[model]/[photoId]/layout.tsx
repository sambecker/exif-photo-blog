import {
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import {
  PATH_ROOT,
  absolutePathForPhoto,
  absolutePathForPhotoImage,
} from '@/site/paths';
import PhotoDetailPage from '@/photo/PhotoDetailPage';
import { getPhotoCached } from '@/photo/cache';
import { PhotoCameraProps, cameraFromPhoto } from '@/camera';
import { getPhotosCameraDataCached } from '@/camera/data';
import { ReactNode, cache } from 'react';

const getPhotoCachedCached =
  cache((photoId: string) => getPhotoCached(photoId));

export async function generateMetadata({
  params: { photoId, make, model },
}: PhotoCameraProps): Promise<Metadata> {
  const photo = await getPhotoCachedCached(photoId);

  if (!photo) { return {}; }

  const title = titleForPhoto(photo);
  const description = descriptionForPhoto(photo);
  const images = absolutePathForPhotoImage(photo);
  const url = absolutePathForPhoto(
    photo,
    undefined,
    cameraFromPhoto(photo, { make, model }),
  );

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

export default async function PhotoCameraPage({
  params: { photoId, make, model },
  children,
}: PhotoCameraProps & { children: ReactNode }) {
  const photo = await getPhotoCachedCached(photoId);

  if (!photo) { redirect(PATH_ROOT); }

  const camera = cameraFromPhoto(photo, { make, model });

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosCameraDataCached({ camera });

  return <>
    {children}
    <PhotoDetailPage {...{ photo, photos, camera, count, dateRange }} />
  </>;
}
