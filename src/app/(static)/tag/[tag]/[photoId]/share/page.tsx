import { getPhotoCached } from '@/cache';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

interface PhotoTagProps {
  params: { photoId: string, tag: string }
}

export default async function Share({
  params: { photoId, tag },
}: PhotoTagProps) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect(PATH_ROOT); }

  return <PhotoShareModal {...{ photo, tag }} />;
}
