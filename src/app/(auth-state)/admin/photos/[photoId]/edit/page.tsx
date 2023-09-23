import PhotoForm from '@/photo/PhotoForm';
import { convertPhotoToFormData } from '@/photo/form';
import AdminChildPage from '@/components/AdminChildPage';
import { redirect } from 'next/navigation';
import { getPhotoCached } from '@/cache';

export const runtime = 'edge';

interface Props {
  params: { photoId: string }
}

export default async function PhotoPageEdit({ params: { photoId } }: Props) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { redirect('/admin'); }

  return (
    <AdminChildPage>
      <PhotoForm
        type="edit"
        initialPhotoForm={convertPhotoToFormData(photo)}
      />
    </AdminChildPage>
  );
};
