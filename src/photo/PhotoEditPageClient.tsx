'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { Photo } from '.';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { BiRefresh } from 'react-icons/bi';
import { PhotoFormData, convertPhotoToFormData } from './form';
import PhotoForm from './PhotoForm';
import { useFormState } from 'react-dom';
import { getExifDataAction } from './actions';

export default function PhotoEditPageClient({
  photo,
}: {
  photo: Photo
}) {
  const [updatedExifData, action] = useFormState<Partial<PhotoFormData>>(
    getExifDataAction,
    { url: photo.url},
  );

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_PHOTOS}
      backLabel="Photos"
      breadcrumb={photo.title || photo.id}
      accessory={
        <form action={action}>
          <input name="photoUrl" value={photo.url} hidden readOnly />
          <SubmitButtonWithStatus
            icon={<BiRefresh size={18} className="translate-y-[-1.5px]" />}
          >
            Refresh EXIF
          </SubmitButtonWithStatus>
        </form>}
    >
      <PhotoForm
        type="edit"
        initialPhotoForm={convertPhotoToFormData(photo)}
        updatedExifData={updatedExifData}
      />
    </AdminChildPage>
  );
};
