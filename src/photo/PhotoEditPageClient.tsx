'use client';

import AdminChildPage from '@/components/AdminChildPage';
import { Photo } from '.';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { PhotoFormData, convertPhotoToFormData } from './form';
import PhotoForm from './PhotoForm';
import { useFormState } from 'react-dom';
import { getExifDataAction } from './actions';
import { GrSync } from 'react-icons/gr';
import { areSimpleObjectsEqual } from '@/utility/object';

export default function PhotoEditPageClient({
  photo,
}: {
  photo: Photo
}) {
  const seedExifData = { url: photo.url };

  const [updatedExifData, action] = useFormState<Partial<PhotoFormData>>(
    getExifDataAction,
    seedExifData,
  );

  const hasExifDataBeenFound = !areSimpleObjectsEqual(
    updatedExifData,
    seedExifData,
  );

  console.log({ hasExifDataBeenFound });

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_PHOTOS}
      backLabel="Photos"
      breadcrumb={photo.title || photo.id}
      accessory={
        <form action={action}>
          <input name="photoUrl" value={photo.url} hidden readOnly />
          <SubmitButtonWithStatus
            icon={<GrSync
              size={15}
              className="translate-y-[0.5px] mr-[4px]"
            />}
          >
            EXIF
          </SubmitButtonWithStatus>
        </form>}
    >
      <PhotoForm
        type="edit"
        initialPhotoForm={convertPhotoToFormData(photo)}
        updatedExifData={hasExifDataBeenFound
          ? updatedExifData
          : undefined}
      />
    </AdminChildPage>
  );
};
