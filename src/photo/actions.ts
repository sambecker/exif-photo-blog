'use server';

import {
  sqlDeletePhoto,
  sqlInsertPhoto,
  sqlDeletePhotoTagGlobally,
  sqlUpdatePhoto,
  sqlRenamePhotoTagGlobally,
  getPhoto,
} from '@/services/postgres';
import {
  PhotoFormData,
  convertFormDataToPhotoDbInsert,
  convertPhotoFormDataToPhotoDbInsert,
  convertPhotoToFormData,
} from './form';
import { redirect } from 'next/navigation';
import {
  convertUploadToPhoto,
  deleteBlobPhoto,
} from '@/services/blob';
import {
  revalidateAdminPaths,
  revalidateAllKeysAndPaths,
  revalidateBlobKey,
  revalidatePhotosKey,
} from '@/cache';
import { PATH_ADMIN_PHOTOS, PATH_ADMIN_TAGS } from '@/site/paths';
import { extractFormDataFromUploadPath } from './server';

export async function createPhotoAction(formData: FormData) {
  const photo = convertFormDataToPhotoDbInsert(formData, true);

  const updatedUrl = await convertUploadToPhoto(photo.url, photo.id);

  if (updatedUrl) { photo.url = updatedUrl; }

  await sqlInsertPhoto(photo);

  revalidateAllKeysAndPaths();

  redirect(PATH_ADMIN_PHOTOS);
}

export async function updatePhotoAction(formData: FormData) {
  const photo = convertFormDataToPhotoDbInsert(formData);

  await sqlUpdatePhoto(photo);

  revalidatePhotosKey();

  redirect(PATH_ADMIN_PHOTOS);
}

export async function deletePhotoAction(formData: FormData) {
  await Promise.all([
    deleteBlobPhoto(formData.get('url') as string),
    sqlDeletePhoto(formData.get('id') as string),
  ]);

  revalidatePhotosKey();
  revalidateAdminPaths();
};

export async function deletePhotoTagGloballyAction(formData: FormData) {
  const tag = formData.get('tag') as string;

  await sqlDeletePhotoTagGlobally(tag);

  revalidatePhotosKey();
  revalidateAdminPaths();
}

export async function renamePhotoTagGloballyAction(formData: FormData) {
  const tag = formData.get('tag') as string;
  const updatedTag = formData.get('updatedTag') as string;

  if (tag && updatedTag && tag !== updatedTag) {
    await sqlRenamePhotoTagGlobally(tag, updatedTag);
    revalidatePhotosKey();
    redirect(PATH_ADMIN_TAGS);
  }
}

export async function deleteBlobPhotoAction(formData: FormData) {
  await deleteBlobPhoto(formData.get('url') as string);

  revalidateBlobKey();
  revalidateAdminPaths();

  if (formData.get('redirectToPhotos') === 'true') {
    redirect(PATH_ADMIN_PHOTOS);
  }
}

export async function getExifDataAction(
  photoFormPrevious: Partial<PhotoFormData>,
): Promise<Partial<PhotoFormData>> {
  const { url } = photoFormPrevious;
  if (url) {
    const { photoForm } = await extractFormDataFromUploadPath(url);
    if (photoForm) {
      return photoForm;
    }
  }
  return {};
}

export async function syncPhotoExifDataAction(formData: FormData) {
  const photoId = formData.get('photoId') as string;
  if (photoId) {
    const photo = await getPhoto(photoId);
    if (photo) {
      const {
        photoForm: photoFormExif,
      } = await extractFormDataFromUploadPath(photo.url);
      if (photoFormExif) {
        const photoFormDbInsert = convertPhotoFormDataToPhotoDbInsert({
          ...convertPhotoToFormData(photo),
          ...photoFormExif,
        });
        await sqlUpdatePhoto(photoFormDbInsert);
        revalidatePhotosKey();
      }
    }
  }
}

export async function syncCacheAction() {
  revalidateAllKeysAndPaths();
}
