'use server';

import {
  sqlDeletePhoto,
  sqlInsertPhoto,
  sqlUpdatePhoto,
} from '@/services/postgres';
import { convertFormDataToPhoto } from './form';
import { redirect } from 'next/navigation';
import {
  convertUploadToPhoto,
  deleteBlobPhoto,
} from '@/services/blob';
import {
  revalidateBlobTag,
  revalidatePhotosAndBlobTag,
  revalidatePhotosTag,
} from '@/cache';
import { IS_PRO_MODE } from '@/site/config';
import { getNextImageUrlForRequest } from '@/utility/image';

export async function createPhotoAction(formData: FormData) {
  const requestOrigin = formData.get('requestOrigin') as string | undefined;
  formData.delete('requestOrigin');

  const photo = convertFormDataToPhoto(formData, true);

  const updatedUrl = await convertUploadToPhoto(
    photo.url,
    photo.id,
    !IS_PRO_MODE
      ? getNextImageUrlForRequest(photo.url, 3840, 90, requestOrigin)
      : undefined,
    !IS_PRO_MODE ? 'webp' : undefined,
  );

  if (updatedUrl) { photo.url = updatedUrl; }

  await sqlInsertPhoto(photo);

  revalidatePhotosAndBlobTag();

  redirect('/admin/photos');
}

export async function updatePhotoAction(formData: FormData) {
  const photo = convertFormDataToPhoto(formData);

  await sqlUpdatePhoto(photo);

  revalidatePhotosTag();

  redirect('/admin/photos');
}

export async function deletePhotoAction(formData: FormData) {
  await Promise.all([
    deleteBlobPhoto(formData.get('url') as string),
    sqlDeletePhoto(formData.get('id') as string),
  ]);

  revalidatePhotosTag();
};

export async function deleteBlobPhotoAction(formData: FormData) {
  await deleteBlobPhoto(formData.get('url') as string);

  revalidateBlobTag();
};
