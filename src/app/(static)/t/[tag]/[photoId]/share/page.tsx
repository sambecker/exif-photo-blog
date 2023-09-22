import { getPhotoCached } from '@/cache';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default async function Share({
  params: { photoId, tag },
}: {
  params: { photoId: string, tag: string }
}) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect('/'); }

  return <PhotoShareModal photo={photo} tag={tag} />;
}
