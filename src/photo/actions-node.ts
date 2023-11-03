'use server';

import {
  sqlUpdatePhoto,
  getPhoto,
} from '@/services/postgres';
import {
  PhotoFormData,
  convertFormDataToPhotoDbInsert,
  convertPhotoToFormData,
} from './form';
import { revalidatePhotosKey } from '@/cache';
import { extractExifDataFromBlobPath } from './server';

export const runtime = 'nodejs';

export async function getExifDataAction(
  photoFormPrevious: Partial<PhotoFormData>,
): Promise<Partial<PhotoFormData>> {
  const { url } = photoFormPrevious;
  if (url) {
    const { photoFormExif } = await extractExifDataFromBlobPath(url);
    if (photoFormExif) {
      return photoFormExif;
    }
  }
  return {};
}

export async function syncPhotoExifDataAction(formData: FormData) {
  const photoId = formData.get('id') as string;
  if (photoId) {
    const photo = await getPhoto(photoId);
    if (photo) {
      const { photoFormExif } = await extractExifDataFromBlobPath(photo.url);
      if (photoFormExif) {
        const photoFormDbInsert = convertFormDataToPhotoDbInsert({
          ...convertPhotoToFormData(photo),
          ...photoFormExif,
        });
        await sqlUpdatePhoto(photoFormDbInsert);
        revalidatePhotosKey();
      }
    }
  }
}
