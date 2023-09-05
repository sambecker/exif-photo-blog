import PhotoModal from '@/photo/PhotoModal';
import { getPhoto } from '@/services/postgres';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

interface Props {
  params: { photoId: string }
}

export default async function Share({ params: { photoId }}: Props) {
  const photo = await getPhoto(photoId);

  if (!photo) { return redirect('/'); }

  return <PhotoModal photo={photo} />;
}
