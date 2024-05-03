'use server';

import {
  sqlDeletePhoto,
  sqlInsertPhoto,
  sqlDeletePhotoTagGlobally,
  sqlUpdatePhoto,
  sqlRenamePhotoTagGlobally,
  getPhoto,
  getPhotos,
} from '@/photo/db';
import {
  PhotoFormData,
  convertFormDataToPhotoDbInsert,
  convertPhotoToFormData,
} from './form';
import { redirect } from 'next/navigation';
import {
  convertUploadToPhoto,
  deleteStorageUrl,
} from '@/services/storage';
import {
  getPhotosCachedCached,
  revalidateAdminPaths,
  revalidateAllKeysAndPaths,
  revalidatePhoto,
  revalidatePhotosKey,
  revalidateTagsKey,
} from '@/photo/cache';
import {
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_TAGS,
  PATH_ROOT,
  pathForPhoto,
} from '@/site/paths';
import { extractExifDataFromBlobPath } from './server';
import { TAG_FAVS, isTagFavs } from '@/tag';
import { convertPhotoToPhotoDbInsert } from '.';
import { safelyRunAdminServerAction } from '@/auth';
import { AI_IMAGE_QUERIES, AiImageQuery } from './ai';
import { streamOpenAiImageQuery } from '@/services/openai';

export async function createPhotoAction(formData: FormData) {
  return safelyRunAdminServerAction(async () => {
    const photo = convertFormDataToPhotoDbInsert(formData, true);

    const updatedUrl = await convertUploadToPhoto(photo.url, photo.id);
  
    if (updatedUrl) { photo.url = updatedUrl; }
  
    await sqlInsertPhoto(photo);
  
    revalidateAllKeysAndPaths();
  
    redirect(PATH_ADMIN_PHOTOS);
  });
}

export async function updatePhotoAction(formData: FormData) {
  return safelyRunAdminServerAction(async () => {
    const photo = convertFormDataToPhotoDbInsert(formData);

    await sqlUpdatePhoto(photo);

    revalidatePhoto(photo.id);

    redirect(PATH_ADMIN_PHOTOS);
  });
}

export async function toggleFavoritePhotoAction(
  photoId: string,
  shouldRedirect?: boolean,
) {
  return safelyRunAdminServerAction(async () => {
    const photo = await getPhoto(photoId);
    if (photo) {
      const { tags } = photo;
      photo.tags = tags.some(tag => tag === TAG_FAVS)
        ? tags.filter(tag => !isTagFavs(tag))
        : [...tags, TAG_FAVS];
      await sqlUpdatePhoto(convertPhotoToPhotoDbInsert(photo));
      revalidateAllKeysAndPaths();
      if (shouldRedirect) {
        redirect(pathForPhoto(photoId));
      }
    }
  });
}

export async function deletePhotoAction(
  photoId: string,
  photoUrl: string,
  shouldRedirect?: boolean,
) {
  return safelyRunAdminServerAction(async () => {
    await sqlDeletePhoto(photoId).then(() => deleteStorageUrl(photoUrl));
    revalidateAllKeysAndPaths();
    if (shouldRedirect) {
      redirect(PATH_ROOT);
    }
  });
};

export async function deletePhotoFormAction(formData: FormData) {
  return safelyRunAdminServerAction(async () =>
    deletePhotoAction(
      formData.get('id') as string,
      formData.get('url') as string,
    )
  );
};

export async function deletePhotoTagGloballyAction(formData: FormData) {
  return safelyRunAdminServerAction(async () => {
    const tag = formData.get('tag') as string;

    await sqlDeletePhotoTagGlobally(tag);

    revalidatePhotosKey();
    revalidateAdminPaths();
  });
}

export async function renamePhotoTagGloballyAction(formData: FormData) {
  return safelyRunAdminServerAction(async () => {
    const tag = formData.get('tag') as string;
    const updatedTag = formData.get('updatedTag') as string;

    if (tag && updatedTag && tag !== updatedTag) {
      await sqlRenamePhotoTagGlobally(tag, updatedTag);
      revalidatePhotosKey();
      revalidateTagsKey();
      redirect(PATH_ADMIN_TAGS);
    }
  });
}

export async function deleteBlobPhotoAction(formData: FormData) {
  return safelyRunAdminServerAction(async () => {
    await deleteStorageUrl(formData.get('url') as string);

    revalidateAdminPaths();

    if (formData.get('redirectToPhotos') === 'true') {
      redirect(PATH_ADMIN_PHOTOS);
    }
  });
}

export async function getExifDataAction(
  photoFormPrevious: Partial<PhotoFormData>,
): Promise<Partial<PhotoFormData>> {
  return safelyRunAdminServerAction(async () => {
    const { url } = photoFormPrevious;
    if (url) {
      const { photoFormExif } = await extractExifDataFromBlobPath(url);
      if (photoFormExif) {
        return photoFormExif;
      }
    }
    return {};
  });
}

export async function syncPhotoExifDataAction(formData: FormData) {
  return safelyRunAdminServerAction(async () => {
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
  });
}

export async function syncCacheAction() {
  return safelyRunAdminServerAction(revalidateAllKeysAndPaths);
}

export async function streamAiImageQueryAction(
  imageBase64: string,
  query: AiImageQuery,
) {
  return safelyRunAdminServerAction(async () =>
    streamOpenAiImageQuery(imageBase64, AI_IMAGE_QUERIES[query]));
}

export const getPhotosCachedAction = async (
  offset: number,
  limit: number,
  includeHidden?: boolean,
) =>
  getPhotosCachedCached({ offset, includeHidden, limit });

export const getPhotosAction = async (
  offset: number,
  limit: number,
  includeHidden?: boolean,
) =>
  getPhotos({ offset, includeHidden, limit });

export const queryPhotosByTitleAction = async (query: string) =>
  (await getPhotos({ query, limit: 10 }))
    .filter(({ title }) => Boolean(title));
