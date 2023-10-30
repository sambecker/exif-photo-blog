'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { Photo } from '.';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { BiRefresh } from 'react-icons/bi';
import { convertPhotoToFormData } from './form';
import PhotoForm from './PhotoForm';

export default function PhotoEditPageClient({
  photo,
}: {
  photo: Photo
}) {
  return (
    <AdminChildPage
      backPath={PATH_ADMIN_PHOTOS}
      backLabel="Photos"
      breadcrumb={photo.title || photo.id}
      accessory={<SubmitButtonWithStatus icon={<BiRefresh size={18} />}>
        Refresh EXIF
      </SubmitButtonWithStatus>}
    >
      <PhotoForm
        type="edit"
        initialPhotoForm={convertPhotoToFormData(photo)}
      />
    </AdminChildPage>
  );
};
