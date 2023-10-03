import { getPhotoCached } from '@/cache';
import { deviceFromPhoto } from '@/device';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { getPhotos, getUniqueDevices } from '@/services/postgres';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  const params: { params: { photoId: string, device: string }}[] = [];

  const devices = await getUniqueDevices();
  devices.forEach(async ({ deviceKey, device }) => {
    const photos = await getPhotos({ device });
    params.push(...photos.map(photo => ({
      params: { photoId: photo.id, device: deviceKey },
    })));
  });

  return params;
}

export default async function Share({
  params: { photoId },
}: {
  params: { photoId: string }
}) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect(PATH_ROOT); }

  const device = deviceFromPhoto(photo);

  return <PhotoShareModal {...{ photo, device }} />;
}
