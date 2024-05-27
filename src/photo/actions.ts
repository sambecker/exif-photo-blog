'use server';

import {
  deletePhoto,
  insertPhoto,
  deletePhotoTagGlobally,
  updatePhoto,
  renamePhotoTagGlobally,
  getPhoto,
  getPhotos,
} from '@/photo/db/query';
import { GetPhotosOptions } from './db';
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
  getPhotosCached,
  getPhotosMetaCached,
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
import { runAuthenticatedAdminServerAction } from '@/auth';
import { AI_IMAGE_QUERIES, AiImageQuery } from './ai';
import { streamOpenAiImageQuery } from '@/services/openai';
import {
  AI_TEXT_AUTO_GENERATED_FIELDS,
  AI_TEXT_GENERATION_ENABLED,
  BLUR_ENABLED,
} from '@/site/config';
import { getStorageUploadUrlsNoStore } from '@/services/storage/cache';
import { generateAiImageQueries } from './ai/server';

// Private actions

export const createPhotoAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const photo = convertFormDataToPhotoDbInsert(formData);

    const updatedUrl = await convertUploadToPhoto(photo.url);
    
    if (updatedUrl) {
      photo.url = updatedUrl;
      await insertPhoto(photo);
      revalidateAllKeysAndPaths();
      redirect(PATH_ADMIN_PHOTOS);
    }
  });

export const addAllUploadsAction = async ({
  tags,
  takenAtLocal,
  takenAtNaiveLocal,
}: {
  tags?: string
  takenAtLocal: string
  takenAtNaiveLocal: string
}) =>
  runAuthenticatedAdminServerAction(async () => {
    const uploadUrls = await getStorageUploadUrlsNoStore();

    for (const { url } of uploadUrls) {
      const {
        photoFormExif,
        imageResizedBase64,
      } = await extractImageDataFromBlobPath(url, {
        includeInitialPhotoFields: true,
        generateBlurData: BLUR_ENABLED,
        generateResizedImage: AI_TEXT_GENERATION_ENABLED,
      });

      if (photoFormExif) {
        const {
          title,
          caption,
          tags: aiTags,
          semanticDescription,
        } = await generateAiImageQueries(
          imageResizedBase64,
          AI_TEXT_AUTO_GENERATED_FIELDS,
        );

        const form: Partial<PhotoFormData> = {
          ...photoFormExif,
          title,
          caption,
          tags: tags || aiTags,
          semanticDescription,
          takenAt: photoFormExif.takenAt || takenAtLocal,
          takenAtNaive: photoFormExif.takenAtNaive || takenAtNaiveLocal,
        };

        const updatedUrl = await convertUploadToPhoto(url);
        if (updatedUrl) {
          const photo = convertFormDataToPhotoDbInsert(form);
          console.log(photo);
          photo.url = updatedUrl;
          await insertPhoto(photo);
        }
      }
    }

    revalidateAllKeysAndPaths();
    redirect(PATH_ADMIN_PHOTOS);
  });

export const updatePhotoAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const photo = convertFormDataToPhotoDbInsert(formData);

    let url: string | undefined;
    if (photo.hidden && photo.url.includes(photo.id)) {
      // Anonymize storage url on update if necessary by
      // re-running image upload transfer logic
      url = await convertUploadToPhoto(photo.url);
      if (url) { photo.url = url; }
    }

    await updatePhoto(photo);

    revalidatePhoto(photo.id);

    redirect(PATH_ADMIN_PHOTOS);
  });

export const toggleFavoritePhotoAction = async (
  photoId: string,
  shouldRedirect?: boolean,
) =>
  runAuthenticatedAdminServerAction(async () => {
    const photo = await getPhoto(photoId);
    if (photo) {
      const { tags } = photo;
      photo.tags = tags.some(tag => tag === TAG_FAVS)
        ? tags.filter(tag => !isTagFavs(tag))
        : [...tags, TAG_FAVS];
      await updatePhoto(convertPhotoToPhotoDbInsert(photo));
      revalidateAllKeysAndPaths();
      if (shouldRedirect) {
        redirect(pathForPhoto({ photo: photoId }));
      }
    }
  });

export const deletePhotoAction = async (
  photoId: string,
  photoUrl: string,
  shouldRedirect?: boolean,
) =>
  runAuthenticatedAdminServerAction(async () => {
    await deletePhoto(photoId).then(() => deleteStorageUrl(photoUrl));
    revalidateAllKeysAndPaths();
    if (shouldRedirect) {
      redirect(PATH_ROOT);
    }
  });

export const deletePhotoFormAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(() =>
    deletePhotoAction(
      formData.get('id') as string,
      formData.get('url') as string,
    )
  );

export const deletePhotoTagGloballyAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const tag = formData.get('tag') as string;

    await deletePhotoTagGlobally(tag);

    revalidatePhotosKey();
    revalidateAdminPaths();
  });

export const renamePhotoTagGloballyAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const tag = formData.get('tag') as string;
    const updatedTag = formData.get('updatedTag') as string;

    if (tag && updatedTag && tag !== updatedTag) {
      await renamePhotoTagGlobally(tag, updatedTag);
      revalidatePhotosKey();
      revalidateTagsKey();
      redirect(PATH_ADMIN_TAGS);
    }
  });

export const deleteBlobPhotoAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
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
  runAuthenticatedAdminServerAction(async () => {
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
  runAuthenticatedAdminServerAction(async () => {
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
          await updatePhoto(photoFormDbInsert);
          revalidatePhotosKey();
        }
      }
    }
  });

export const syncCacheAction = async () =>
  runAuthenticatedAdminServerAction(revalidateAllKeysAndPaths);

export const streamAiImageQueryAction = async (
  imageBase64: string,
  query: AiImageQuery,
) =>
  runAuthenticatedAdminServerAction(() =>
    streamOpenAiImageQuery(imageBase64, AI_IMAGE_QUERIES[query]));

export const getImageBlurAction = async (url: string) =>
  runAuthenticatedAdminServerAction(() => blurImageFromUrl(url));

export const getPhotosHiddenMetaCachedAction = async () =>
  runAuthenticatedAdminServerAction(() =>
    getPhotosMetaCached({ hidden: 'only' }));

// Public/Private actions

export const getPhotosAction = async (options: GetPhotosOptions) =>
  (options.hidden === 'include' || options.hidden === 'only')
    ? runAuthenticatedAdminServerAction(() => getPhotos(options))
    : getPhotos(options);

export const getPhotosCachedAction = async (options: GetPhotosOptions) =>
  (options.hidden === 'include' || options.hidden === 'only')
    ? runAuthenticatedAdminServerAction(() => getPhotosCached (options))
    : getPhotosCached(options);

// Public actions

export const queryPhotosByTitleAction = async (query: string) =>
  (await getPhotos({ query, limit: 10 }))
    .filter(({ title }) => Boolean(title));
