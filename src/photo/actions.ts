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

export async function createPhotoAction(formData: FormData) {
  const photo = convertFormDataToPhoto(formData, true);

  const updatedUrl = await convertUploadToPhoto(
    photo.url,
    photo.id,
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
