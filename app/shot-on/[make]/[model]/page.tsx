import { Metadata } from 'next/types';
import { Camera, CameraProps } from '@/camera';
import { generateMetaForCamera } from '@/camera/meta';
import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getPhotosCameraDataCached } from '@/camera/data';
import CameraOverview from '@/camera/CameraOverview';
import { cache } from 'react';
import { getUniqueCameras } from '@/photo/db/query';
import { shouldGenerateStaticParamsForCategory } from '@/category/set';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';

const getPhotosCameraDataCachedCached = cache((
  make: string,
  model: string,
) => getPhotosCameraDataCached(
  make,
  model,
  INFINITE_SCROLL_GRID_INITIAL,
));

export let generateStaticParams:
  (() => Promise<Camera[]>) | undefined = undefined;

if (shouldGenerateStaticParamsForCategory('cameras', 'page')) {
  generateStaticParams = async () => {
    const cameras = await getUniqueCameras();
    return cameras
      .map(({ camera: { make, model } }) => ({ make, model }))
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT);
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
