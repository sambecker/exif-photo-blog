import { Metadata } from 'next/types';
import { CameraProps, getCameraFromParams } from '@/camera';
import { generateMetaForCamera } from '@/camera/meta';
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

export default async function CameraPage({
  params,
  searchParams,
}: CameraProps & PaginationParams) {
  const camera = getCameraFromParams(params);

  const {
    photos,
    count,
    showMorePath,
    dateRange,
  } = await getPhotosCameraDataCachedWithPagination({
    camera,
    searchParams,
  });

  return (
    <CameraOverview {...{ camera, photos, count, dateRange, showMorePath }} />
  );
}
