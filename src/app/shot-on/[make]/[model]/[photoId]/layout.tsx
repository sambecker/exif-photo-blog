import {
  INFINITE_SCROLL_GRID_PHOTO_INITIAL,
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

const getPhotoCachedCached = cache(getPhotoCached);

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

  const [
    photos,
    { count, dateRange },
    camera,
  ] = await getPhotosCameraDataCached(
    make,
    model,
    INFINITE_SCROLL_GRID_PHOTO_INITIAL,
  );

  return <>
    {children}
    <PhotoDetailPage {...{ photo, photos, camera, count, dateRange }} />
  </>;
}
