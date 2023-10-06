import PhotoForm from '@/photo/PhotoForm';
import { convertPhotoToFormData } from '@/photo/form';
import AdminChildPage from '@/components/AdminChildPage';
import { redirect } from 'next/navigation';
import { getPhotoCached } from '@/cache';
import { PATH_ADMIN, PATH_ADMIN_PHOTOS } from '@/site/paths';

export const runtime = 'edge';

interface Props {
  params: { photoId: string }
}

export default async function PhotoPageEdit({ params: { photoId } }: Props) {
  const photo = await getPhotoCached(photoId);

  if (!photo) { redirect(PATH_ADMIN); }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_PHOTOS}
      backLabel="Photos"
      breadcrumb={photo.title || photo.id}
    >
      <PhotoForm
        type="edit"
        initialPhotoForm={convertPhotoToFormData(photo)}
      />
    </AdminChildPage>
  );
};
