import { getPhotoCached } from '@/cache';
import PhotoShareModal from '@/photo/PhotoShareModal';
import { getPhotos, getUniqueTags } from '@/services/postgres';
import { PATH_ROOT } from '@/site/paths';
import { redirect } from 'next/navigation';

interface PhotoTagProps {
  params: { photoId: string, tag: string }
}

export async function generateStaticParams() {
  const params: PhotoTagProps[] = [];

  const tags = await getUniqueTags();
  tags.forEach(async ({ tag }) => {
    const photos = await getPhotos({ tag });
    params.push(...photos.map(photo => ({
      params: { photoId: photo.id, tag },
    })));
  });

  return params;
}

export default async function Share({
  params: { photoId, tag },
}: PhotoTagProps) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { return redirect(PATH_ROOT); }

  return <PhotoShareModal photo={photo} tag={tag} />;
}
