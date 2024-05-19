import {
  CameraProps,
  cameraFromPhoto,
  getCameraFromParams,
} from '@/camera';
import CameraShareModal from '@/camera/CameraShareModal';
import { generateMetaForCamera } from '@/camera/meta';
import { Metadata } from 'next/types';
import {
  GRID_THUMBNAILS_TO_SHOW_MAX,
  INFINITE_SCROLL_INITIAL_GRID,
} from '@/photo';
import { getPhotosCameraDataCached } from '@/camera/data';
import CameraOverview from '@/camera/CameraOverview';
import { cache } from 'react';

const getPhotosCameraDataCachedCached = cache(getPhotosCameraDataCached);

export async function generateMetadata({
  params,
}: CameraProps): Promise<Metadata> {
  const camera = getCameraFromParams(params);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosCameraDataCachedCached({
    camera,
    limit: GRID_THUMBNAILS_TO_SHOW_MAX,
  });

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForCamera(camera, photos, count, dateRange);

  return {
    title,
    openGraph: {
      title,
      description,
      images,
      url,
    },
    twitter: {
      images,
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function Share({ params }: CameraProps) {
  const cameraFromParams = getCameraFromParams(params);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosCameraDataCachedCached({
    camera: cameraFromParams,
    limit: INFINITE_SCROLL_INITIAL_GRID,
  });

  const camera = cameraFromPhoto(photos[0], cameraFromParams);

  return <>
    <CameraShareModal {...{ camera, photos, count, dateRange }} />
    <CameraOverview
      {...{ camera, photos, count, dateRange }}
      animateOnFirstLoadOnly
    />
  </>;
}
