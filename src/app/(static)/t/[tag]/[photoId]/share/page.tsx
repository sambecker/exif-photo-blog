import PhotoModal from '@/photo/PhotoModal';
import { getPhoto } from '@/services/postgres';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default async function Share({
  params: { photoId, tag },
}: {
  params: { photoId: string, tag: string }
}) {
  const photo = await getPhoto(photoId);

  if (!photo) { return redirect('/'); }

  return <PhotoModal photo={photo} tag={tag} />;
}
