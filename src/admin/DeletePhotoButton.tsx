'use client';

import { deleteConfirmationTextForPhoto, Photo, titleForPhoto } from '@/photo';
import DeletePhotosButton from './DeletePhotosButton';
import { ComponentProps } from 'react';

export default function DeletePhotoButton({
  photo,
  ...rest
}: {
  photo: Photo
} & ComponentProps<typeof DeletePhotosButton>) {
  return (
    <DeletePhotosButton
      {...rest}
      photoIds={[photo.id]}
      confirmText={deleteConfirmationTextForPhoto(photo)}
      toastText={`"${titleForPhoto(photo)}" deleted`}
    />
  );
}
