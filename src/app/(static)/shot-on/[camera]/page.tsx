import { getPhotosCached, getPhotosCountCameraCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import CameraHeader from '@/camera/CameraHeader';
import { getMakeModelFromCameraString } from '@/camera';
import PhotoGrid from '@/photo/PhotoGrid';
import { getUniqueCameras } from '@/services/postgres';
import { Metadata } from 'next';
import { generateMetaForCamera } from '@/camera/meta';
import { GRID_THUMBNAILS_TO_SHOW_MAX } from '@/photo';
import { pathForCamera } from '@/site/paths';
import {
  PaginationParams,
  getPaginationForSearchParams,
} from '@/site/pagination';

interface CameraProps {
  params: { camera: string },
}

export async function generateStaticParams() {
  const cameras = await getUniqueCameras();
  return cameras.map(({ cameraKey }): CameraProps => ({
    params: { camera: cameraKey },
  }));
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

export default async function CameraPage({
  params,
  searchParams,
}: CameraProps & PaginationParams) {
  const camera = getMakeModelFromCameraString(params.camera);

  const { offset, limit } = getPaginationForSearchParams(searchParams);
  
  const [
    photos,
    count,
  ] = await Promise.all([
    getPhotosCached({ camera, limit }),
    getPhotosCountCameraCached(camera),
  ]);

  const showMorePath = count > photos.length
    ? pathForCamera(camera, offset + 1)
    : undefined;

  return (
    <SiteGrid
      key="Camera Grid"
      contentMain={<div className="space-y-8 mt-4">
        <CameraHeader {...{ camera, photos, count }} />
        <PhotoGrid {...{ photos, camera, showMorePath }} />
      </div>}
    />
  );
}
