import { getPhotosCached, getPhotosCountCameraCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import { cameraFromPhoto, getMakeModelFromCameraString } from '@/camera';
import CameraHeader from '@/camera/CameraHeader';
import CameraShareModal from '@/camera/CameraShareModal';
import { generateMetaForCamera } from '@/camera/meta';
import PhotoGrid from '@/photo/PhotoGrid';
import { Metadata } from 'next';
import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import { pathForCamera } from '@/site/paths';
import {
  PaginationParams,
  getPaginationForSearchParams,
} from '@/site/pagination';

export const runtime = 'edge';

interface CameraProps {
  params: { camera: string }
}

export async function generateMetadata({
  params,
}: CameraProps): Promise<Metadata> {
  const camera = getMakeModelFromCameraString(params.camera);

  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ camera, limit: GRID_THUMBNAILS_TO_SHOW_MAX }),
    getPhotosCountCameraCached(camera),
  ]);

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForCamera(camera, photos, count);

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
  const cameraFromParams = getMakeModelFromCameraString(params.camera);

  const { offset, limit } = getPaginationForSearchParams(searchParams);
  
  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ camera: cameraFromParams, limit }),
    getPhotosCountCameraCached(cameraFromParams),
  ]);

  const camera = cameraFromPhoto(photos[0], cameraFromParams);

  const showMorePath = count > photos.length
    ? pathForCamera(camera, offset + 1)
    : undefined;

  return <>
    <CameraShareModal {...{ camera, photos, count }} />
    <SiteGrid
      key="Camera Grid"
      contentMain={<div className="space-y-8 mt-4">
        <CameraHeader {...{ camera, photos, count }} />
        <PhotoGrid {...{ photos, camera, showMorePath, animate: false }} />
      </div>}
    />
  </>;
}
