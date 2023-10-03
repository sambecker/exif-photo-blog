import { getPhotosCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import { cameraFromPhoto, getMakeModelFromCameraString } from '@/camera';
import CameraHeader from '@/camera/CameraHeader';
import CameraShareModal from '@/camera/CameraShareModal';
import { generateMetaForCamera } from '@/camera/meta';
import PhotoGrid from '@/photo/PhotoGrid';
import { getUniqueCameras } from '@/services/postgres';
import { Metadata } from 'next';

interface CameraProps {
  params: { camera: string }
}

export async function generateStaticParams() {
  const camera = await getUniqueCameras();
  return camera.map(({ cameraKey }): CameraProps => ({
    params: { camera: cameraKey },
  }));
}

export async function generateMetadata({
  params,
}: CameraProps): Promise<Metadata> {
  const camera = getMakeModelFromCameraString(params.camera);

  const photos = await getPhotosCached({ camera });

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForCamera(camera, photos);

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
  const cameraFromParams = getMakeModelFromCameraString(params.camera);

  const photos = await getPhotosCached({ camera: cameraFromParams });

  const camera = cameraFromPhoto(photos[0], cameraFromParams);

  return <>
    <CameraShareModal {...{ camera, photos }} />
    <SiteGrid
      key="Camera Grid"
      contentMain={<div className="space-y-8 mt-4">
        <CameraHeader camera={camera} photos={photos} />
        <PhotoGrid photos={photos} camera={camera} />
      </div>}
    />
  </>;
}
