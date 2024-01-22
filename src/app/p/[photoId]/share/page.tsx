import PhotoShareModal from '@/photo/PhotoShareModal';
import { getPhoto } from '@/services/vercel-postgres';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

export default async function Share({
  params: { photoId },
}: {
  params: { photoId: string }
}) {
  const photo = await getPhoto(photoId);

  if (!photo) { return redirect(PATH_ROOT); }

  return <PhotoShareModal photo={photo} />;
}
