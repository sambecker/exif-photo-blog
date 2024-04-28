import {
  CameraProps,
  cameraFromPhoto,
  getCameraFromParams,
} from '@/camera';
import CameraShareModal from '@/camera/CameraShareModal';
import { generateMetaForCamera } from '@/camera/meta';
import { Metadata } from 'next/types';
import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import { PaginationParams } from '@/site/pagination';
import {
  getPhotosCameraDataCached,
  getPhotosCameraDataCachedWithPagination,
} from '@/camera/data';
import CameraOverview from '@/camera/CameraOverview';

export async function generateMetadata({
  params,
}: CameraProps): Promise<Metadata> {
  const camera = getCameraFromParams(params);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosCameraDataCached({
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

export default async function Share({
  params,
  searchParams,
}: CameraProps & PaginationParams) {
  const cameraFromParams = getCameraFromParams(params);

  const {
    photos,
    count,
    dateRange,
    showMorePath,
  } = await getPhotosCameraDataCachedWithPagination({
    camera: cameraFromParams,
    searchParams,
  });

  const camera = cameraFromPhoto(photos[0], cameraFromParams);

  return <>
    <CameraShareModal {...{ camera, photos, count, dateRange }} />
    <CameraOverview
      {...{ camera, photos, count, dateRange, showMorePath }}
      animateOnFirstLoadOnly
    />
  </>;
}
