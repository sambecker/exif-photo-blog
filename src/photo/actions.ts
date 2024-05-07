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
import { blurImageFromUrl, extractImageDataFromBlobPath } from './server';
import { TAG_FAVS, isTagFavs } from '@/tag';
import { convertPhotoToPhotoDbInsert } from '.';
import { safelyRunAdminServerAction } from '@/auth';
import { AI_IMAGE_QUERIES, AiImageQuery } from './ai';
import { streamOpenAiImageQuery } from '@/services/openai';
import { BLUR_ENABLED } from '@/site/config';

// Private actions

export const createPhotoAction = async (formData: FormData) =>
  safelyRunAdminServerAction(async () => {
    const photo = convertFormDataToPhotoDbInsert(formData, true);

    const updatedUrl = await convertUploadToPhoto(photo.url, photo.id);
  
    if (updatedUrl) { photo.url = updatedUrl; }
  
    await sqlInsertPhoto(photo);
  
    revalidateAllKeysAndPaths();
  
    redirect(PATH_ADMIN_PHOTOS);
  });

export const updatePhotoAction = async (formData: FormData) =>
  safelyRunAdminServerAction(async () => {
    const photo = convertFormDataToPhotoDbInsert(formData);

    await sqlUpdatePhoto(photo);

    revalidatePhoto(photo.id);

    redirect(PATH_ADMIN_PHOTOS);
  });

export const toggleFavoritePhotoAction = async (
  photoId: string,
  shouldRedirect?: boolean,
) =>
  safelyRunAdminServerAction(async () => {
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

export const deletePhotoAction = async (
  photoId: string,
  photoUrl: string,
  shouldRedirect?: boolean,
) =>
  safelyRunAdminServerAction(async () => {
    await sqlDeletePhoto(photoId).then(() => deleteStorageUrl(photoUrl));
    revalidateAllKeysAndPaths();
    if (shouldRedirect) {
      redirect(PATH_ROOT);
    }
  });

export const deletePhotoFormAction = async (formData: FormData) =>
  safelyRunAdminServerAction(() =>
    deletePhotoAction(
      formData.get('id') as string,
      formData.get('url') as string,
    )
  );

export const deletePhotoTagGloballyAction = async (formData: FormData) =>
  safelyRunAdminServerAction(async () => {
    const tag = formData.get('tag') as string;

    await sqlDeletePhotoTagGlobally(tag);

    revalidatePhotosKey();
    revalidateAdminPaths();
  });

export const renamePhotoTagGloballyAction = async (formData: FormData) =>
  safelyRunAdminServerAction(async () => {
    const tag = formData.get('tag') as string;
    const updatedTag = formData.get('updatedTag') as string;

    if (tag && updatedTag && tag !== updatedTag) {
      await sqlRenamePhotoTagGlobally(tag, updatedTag);
      revalidatePhotosKey();
      revalidateTagsKey();
      redirect(PATH_ADMIN_TAGS);
    }
  });

export const deleteBlobPhotoAction = async (formData: FormData) =>
  safelyRunAdminServerAction(async () => {
    await deleteStorageUrl(formData.get('url') as string);

    revalidateAdminPaths();

    if (formData.get('redirectToPhotos') === 'true') {
      redirect(PATH_ADMIN_PHOTOS);
    }
  });

// Accessed from admin photo edit page
// will not update blur data
export const getExifDataAction = async (
  photoFormPrevious: Partial<PhotoFormData>,
): Promise<Partial<PhotoFormData>> =>
  safelyRunAdminServerAction(async () => {
    const { url } = photoFormPrevious;
    if (url) {
      const { photoFormExif } = await extractImageDataFromBlobPath(url);
      if (photoFormExif) {
        return photoFormExif;
      }
    }
    return {};
  });

// Accessed from admin photo table
// will update blur data
export const syncPhotoExifDataAction = async (formData: FormData) =>
  safelyRunAdminServerAction(async () => {
    const photoId = formData.get('id') as string;
    if (photoId) {
      const photo = await getPhoto(photoId);
      if (photo) {
        const { photoFormExif } = await extractImageDataFromBlobPath(
          photo.url, {
            generateBlurData: BLUR_ENABLED,
          });
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

export const syncCacheAction = async () =>
  safelyRunAdminServerAction(revalidateAllKeysAndPaths);

export const streamAiImageQueryAction = async (
  imageBase64: string,
  query: AiImageQuery,
) =>
  safelyRunAdminServerAction(() =>
    streamOpenAiImageQuery(imageBase64, AI_IMAGE_QUERIES[query]));

export const getImageBlurAction = async (url: string) =>
  safelyRunAdminServerAction(() => blurImageFromUrl(url));

// Public actions

export const getPhotosAction = async (
  offset: number,
  limit: number,
  includeHidden?: boolean,
) =>
  getPhotos({ offset, includeHidden, limit });

export const getPhotosCachedAction = async (
  offset: number,
  limit: number,
  includeHidden?: boolean,
) =>
  getPhotosCachedCached({ offset, includeHidden, limit });

export const queryPhotosByTitleAction = async (query: string) =>
  (await getPhotos({ query, limit: 10 }))
    .filter(({ title }) => Boolean(title));
