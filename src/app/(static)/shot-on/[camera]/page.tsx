import { getPhotosCached } from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import CameraHeader from '@/camera/CameraHeader';
import { getMakeModelFromCameraString } from '@/camera';
import PhotoGrid from '@/photo/PhotoGrid';
import { getUniqueCameras } from '@/services/postgres';
import { Metadata } from 'next';
import { generateMetaForCamera } from '@/camera/meta';

interface CameraProps {
  params: { camera: string }
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

export default async function CameraPage({ params }:CameraProps) {
  const camera = getMakeModelFromCameraString(params.camera);
  
  const photos = await getPhotosCached({ camera });

  return (
    <SiteGrid
      key="Camera Grid"
      contentMain={<div className="space-y-8 mt-4">
        <CameraHeader camera={camera} photos={photos} />
        <PhotoGrid photos={photos} camera={camera} />
      </div>}
    />
  );
}
