'use client';

import { deleteConfirmationTextForPhoto, Photo, titleForPhoto } from '@/photo';
import DeletePhotosButton from './DeletePhotosButton';
import { ComponentProps } from 'react';
import { useAppText } from '@/i18n/state/client';

export default function DeletePhotoButton({
  photo,
  ...rest
}: {
  photo: Photo
} & ComponentProps<typeof DeletePhotosButton>) {
  const appText = useAppText();
  return (
    <DeletePhotosButton
      {...rest}
      photoIds={[photo.id]}
      confirmText={deleteConfirmationTextForPhoto(photo, appText)}
      toastText={`"${titleForPhoto(photo)}" deleted`}
    />
  );
}
