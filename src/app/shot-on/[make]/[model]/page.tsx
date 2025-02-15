import { Metadata } from 'next/types';
import { CameraProps } from '@/camera';
import { generateMetaForCamera } from '@/camera/meta';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getPhotosCameraDataCached } from '@/camera/data';
import CameraOverview from '@/camera/CameraOverview';
import { cache } from 'react';
import { STATICALLY_OPTIMIZED_PHOTO_CATEGORIES } from '@/site/config';
import { IS_PRODUCTION } from '@/site/config';
import { getUniqueCameras } from '@/photo/db/query';

const getPhotosCameraDataCachedCached = cache((
  make: string,
  model: string,
) => getPhotosCameraDataCached(
  make,
  model,
  INFINITE_SCROLL_GRID_INITIAL,
));

export let generateStaticParams:
  (() => Promise<{ make: string, model: string }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORIES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const cameras = await getUniqueCameras();
    return cameras.map(({ camera: { make, model } }) => ({ make, model }));
  };
}

export async function generateMetadata({
  params,
}: CameraProps): Promise<Metadata> {
  const { make, model } = await params;

  const [
    photos,
    { count, dateRange },
    camera,
  ] = await getPhotosCameraDataCachedCached(make, model);

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

export default async function CameraPage({
  params,
}: CameraProps) {
  const { make, model } = await params;

  const [
    photos,
    { count, dateRange },
    camera,
  ] = await getPhotosCameraDataCachedCached(make, model);

  return (
    <CameraOverview {...{ camera, photos, count, dateRange }} />
  );
}
