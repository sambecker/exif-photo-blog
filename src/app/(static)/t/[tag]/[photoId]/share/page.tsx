import { getPhotoCached } from '@/cache';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { getPhotos, getUniqueTags } from '@/services/postgres';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  const params: { params: { photoId: string, tag: string }}[] = [];

  const tags = await getUniqueTags();
  tags.forEach(async tag => {
    const photos = await getPhotos({ tag });
    params.push(...photos.map(photo => ({
      params: { photoId: photo.id, tag },
    })));
  });

  return params;
}

export default async function Share({
  params: { photoId, tag },
}: {
  params: { photoId: string, tag: string }
}) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect('/'); }

  return <PhotoShareModal photo={photo} tag={tag} />;
}
