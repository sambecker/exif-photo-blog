import { getPhotoCached } from '@/cache';
import { cameraFromPhoto } from '@/camera';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

export default async function Share({
  params: { photoId, camera: cameraProp },
}: {
  params: { photoId: string, camera: string }
}) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect(PATH_ROOT); }

  const camera = cameraFromPhoto(photo, cameraProp);

  return <PhotoShareModal {...{ photo, camera }} />;
}
