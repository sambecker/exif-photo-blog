import { getPhotoCached } from '@/cache';
import { cameraFromPhoto } from '@/camera';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { getPhotos, getUniqueCameras } from '@/services/postgres';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

interface PhotoCameraParams {
  params: { photoId: string, camera: string }
}

export async function generateStaticParams() {
  const params: PhotoCameraParams[] = [];

  const cameras = await getUniqueCameras();
  cameras.forEach(async ({ cameraKey, camera }) => {
    const photos = await getPhotos({ camera });
    params.push(...photos.map(photo => ({
      params: { photoId: photo.id, camera: cameraKey },
    })));
  });

  return params;
}

export default async function Share({
  params: { photoId, camera: cameraProp },
}: PhotoCameraParams) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect(PATH_ROOT); }

  const camera = cameraFromPhoto(photo, cameraProp);

  return <PhotoShareModal {...{ photo, camera }} />;
}
