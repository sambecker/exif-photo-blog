import PhotoModal from '@/photo/PhotoModal';
import { getPhoto } from '@/services/postgres';

export const runtime = 'edge';

interface Props {
  params: { photoId: string }
}

export default async function Share({ params: { photoId }}: Props) {
  const photo = await getPhoto(photoId);
  return <PhotoModal photo={photo} />;
}
