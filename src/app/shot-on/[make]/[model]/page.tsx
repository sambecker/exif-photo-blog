import { Metadata } from 'next/types';
import { CameraProps, getCameraFromParams } from '@/camera';
import { generateMetaForCamera } from '@/camera/meta';
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

export default async function CameraPage({ params }: CameraProps) {
  const camera = getCameraFromParams(params);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosCameraDataCachedCached({
    camera,
    limit: INFINITE_SCROLL_INITIAL_GRID,
  });

  return (
    <CameraOverview {...{ camera, photos, count, dateRange }} />
  );
}
