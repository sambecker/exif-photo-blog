'use server';

import {
  deletePhoto,
  insertPhoto,
  deletePhotoTagGlobally,
  updatePhoto,
  renamePhotoTagGlobally,
  getPhoto,
  getPhotos,
  addTagsToPhotos,
  getUniqueTags,
  deletePhotoRecipeGlobally,
  renamePhotoRecipeGlobally,
  getPhotosNeedingRecipeTitleCount,
} from '@/photo/db/query';
import { GetPhotosOptions, areOptionsSensitive } from './db';
import {
  FIELDS_TO_NOT_OVERWRITE_WITH_NULL_DATA_ON_SYNC,
  PhotoFormData,
  convertPhotoToFormData,
} from './form';
import { redirect } from 'next/navigation';
import { deleteFile } from '@/platforms/storage';
import {
  getPhotosCached,
  revalidateAdminPaths,
  revalidateAllKeysAndPaths,
  revalidatePhoto,
  revalidatePhotosKey,
  revalidateRecipesKey,
  revalidateTagsKey,
} from '@/photo/cache';
import {
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_RECIPES,
  PATH_ADMIN_TAGS,
  PATH_ROOT,
  pathForPhoto,
} from '@/app/paths';
import {
  blurImageFromUrl,
  convertFormDataToPhotoDbInsertAndLookupRecipeTitle,
  extractImageDataFromBlobPath,
  propagateRecipeTitleIfNecessary,
} from './server';
import { TAG_FAVS, isPhotoFav, isTagFavs } from '@/tag';
import { convertPhotoToPhotoDbInsert, Photo } from '.';
import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { AiImageQuery, getAiImageQuery } from './ai';
import { streamOpenAiImageQuery } from '@/platforms/openai';
import {
  AI_TEXT_AUTO_GENERATED_FIELDS,
  AI_TEXT_GENERATION_ENABLED,
  BLUR_ENABLED,
} from '@/app/config';
import { generateAiImageQueries } from './ai/server';
import { createStreamableValue } from 'ai/rsc';
import { convertUploadToPhoto } from './storage';
import { UrlAddStatus } from '@/admin/AdminUploadsClient';
import { convertStringToArray } from '@/utility/string';
import { after } from 'next/server';

// Private actions

export const createPhotoAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const shouldStripGpsData = formData.get('shouldStripGpsData') === 'true';

    const photo = await convertFormDataToPhotoDbInsertAndLookupRecipeTitle(
      formData,
    );

    const updatedUrl = await convertUploadToPhoto({
      urlOrigin: photo.url,
      shouldStripGpsData,
    });
    
    if (updatedUrl) {
      photo.url = updatedUrl;
      await insertPhoto(photo);
      await propagateRecipeTitleIfNecessary(formData, photo);
      revalidateAllKeysAndPaths();
      redirect(PATH_ADMIN_PHOTOS);
    }
  });

export const addUploadsAction = async ({
  uploadUrls,
  uploadTitles,
  tags,
  favorite,
  hidden,
  takenAtLocal,
  takenAtNaiveLocal,
  shouldRevalidateAllKeysAndPaths = true,
}: {
  uploadUrls: string[]
  uploadTitles: string[]
  tags?: string
  favorite?: string
  hidden?: string
  takenAtLocal: string
  takenAtNaiveLocal: string
  shouldRevalidateAllKeysAndPaths?: boolean
}) =>
  runAuthenticatedAdminServerAction(async () => {
    const PROGRESS_TASK_COUNT = AI_TEXT_GENERATION_ENABLED ? 5 : 4;

    const addedUploadUrls: string[] = [];
    let currentUploadUrl = '';
    let progress = 0;

    const stream = createStreamableValue<Omit<UrlAddStatus, 'fileName'>>();

    const streamUpdate = (
      statusMessage: string,
      status: UrlAddStatus['status'] = 'adding',
    ) =>
      stream.update({
        url: currentUploadUrl,
        status,
        statusMessage,
        progress: ++progress / PROGRESS_TASK_COUNT,
      });

    (async () => {
      try {
        for (const [index, url] of uploadUrls.entries()) {
          currentUploadUrl = url;
          const title = uploadTitles[index];
          progress = 0;
          streamUpdate('Parsing EXIF data');

          const {
            formDataFromExif,
            imageResizedBase64,
            shouldStripGpsData,
            fileBytes,
          } = await extractImageDataFromBlobPath(url, {
            includeInitialPhotoFields: true,
            generateBlurData: BLUR_ENABLED,
            generateResizedImage: AI_TEXT_GENERATION_ENABLED,
          });

          if (formDataFromExif) {
            if (AI_TEXT_GENERATION_ENABLED) {
              streamUpdate('Generating AI text');
            }

            const {
              title: aiTitle,
              caption,
              tags: aiTags,
              semanticDescription,
            } = await generateAiImageQueries(
              imageResizedBase64,
              Boolean(title)
                ? AI_TEXT_AUTO_GENERATED_FIELDS
                  .filter(field => field !== 'title')
                : AI_TEXT_AUTO_GENERATED_FIELDS,
              title,
            );

            const form: Partial<PhotoFormData> = {
              ...formDataFromExif,
              title: title || aiTitle,
              caption,
              tags: tags || aiTags,
              hidden,
              favorite,
              semanticDescription,
              takenAt: formDataFromExif.takenAt || takenAtLocal,
              takenAtNaive: formDataFromExif.takenAtNaive || takenAtNaiveLocal,
            };

            streamUpdate('Transferring to photo storage');

            const updatedUrl = await convertUploadToPhoto({
              urlOrigin: url,
              fileBytes,
              shouldStripGpsData,
            });
            if (updatedUrl) {
              const subheadFinal = 'Adding to database';
              streamUpdate(subheadFinal);
              const photo =
                await convertFormDataToPhotoDbInsertAndLookupRecipeTitle(form);
              photo.url = updatedUrl;
              await insertPhoto(photo);
              addedUploadUrls.push(url);
              // Re-submit with updated url
              streamUpdate(subheadFinal, 'added');
            }
          }
        };
      } catch (error: any) {
        // eslint-disable-next-line max-len
        stream.error(`${error.message} (${addedUploadUrls.length} of ${uploadUrls.length} photos successfully added)`);
      }
      stream.done();
    })();

    if (shouldRevalidateAllKeysAndPaths) {
      after(revalidateAllKeysAndPaths);
    }

    return stream.value;
  });

export const updatePhotoAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const photo =
      await convertFormDataToPhotoDbInsertAndLookupRecipeTitle(formData);

    let urlToDelete: string | undefined;
    if (photo.hidden && photo.url.includes(photo.id)) {
      // Backfill:
      // Anonymize storage url on update if necessary by
      // re-running image upload transfer logic
      const url = await convertUploadToPhoto({
        urlOrigin: photo.url,
        shouldDeleteOrigin: false,
      });
      if (url) {
        urlToDelete = photo.url;
        photo.url = url;
      }
    }

    await updatePhoto(photo)
      .then(async () => {
        if (urlToDelete) {
          await deleteFile(urlToDelete);
        }
        await propagateRecipeTitleIfNecessary(formData, photo);
      });

    revalidatePhoto(photo.id);

    redirect(PATH_ADMIN_PHOTOS);
  });

export const tagMultiplePhotosAction = async (
  tags: string,
  photoIds: string[],
) =>
  runAuthenticatedAdminServerAction(async () => {
    await addTagsToPhotos(
      convertStringToArray(tags, false) ?? [],
      photoIds,
    );
    revalidateAllKeysAndPaths();
  });

export const toggleFavoritePhotoAction = async (
  photoId: string,
  shouldRedirect?: boolean,
) =>
  runAuthenticatedAdminServerAction(async () => {
    const photo = await getPhoto(photoId);
    if (photo) {
      const { tags } = photo;
      photo.tags = isPhotoFav(photo)
        ? tags.filter(tag => !isTagFavs(tag))
        : [...tags, TAG_FAVS];
      await updatePhoto(convertPhotoToPhotoDbInsert(photo));
      revalidateAllKeysAndPaths();
      if (shouldRedirect) {
        redirect(pathForPhoto({ photo: photoId }));
      }
    }
  });

export const toggleHidePhotoAction = async (
  photoId: string,
  redirectPath?: string,
) =>
  runAuthenticatedAdminServerAction(async () => {
    const photo = await getPhoto(photoId, true);
    if (photo) {
      photo.hidden = !photo.hidden;
      await updatePhoto(convertPhotoToPhotoDbInsert(photo));
      revalidateAllKeysAndPaths();
    }
    if (redirectPath) { redirect(redirectPath); }
  });

export const deletePhotosAction = async (photoIds: string[]) =>
  runAuthenticatedAdminServerAction(async () => {
    for (const photoId of photoIds) {
      const photo = await getPhoto(photoId, true);
      if (photo) {
        await deletePhoto(photoId).then(() => deleteFile(photo.url));
      }
    }
    revalidateAllKeysAndPaths();
  });

export const deletePhotoAction = async (
  photoId: string,
  photoUrl: string,
  shouldRedirect?: boolean,
) =>
  runAuthenticatedAdminServerAction(async () => {
    await deletePhoto(photoId).then(() => deleteFile(photoUrl));
    revalidateAllKeysAndPaths();
    if (shouldRedirect) {
      redirect(PATH_ROOT);
    }
  });

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

export const getPhotosNeedingRecipeTitleCountAction = async (
  recipeData: string,
  film: string,
  photoIdToExclude?: string,
) =>
  runAuthenticatedAdminServerAction(async () =>
    await getPhotosNeedingRecipeTitleCount(
      recipeData,
      film,
      photoIdToExclude,
    ),
  );

export const deletePhotoRecipeGloballyAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const recipe = formData.get('recipe') as string;

    await deletePhotoRecipeGlobally(recipe);

    revalidatePhotosKey();
    revalidateAdminPaths();
  });

export const renamePhotoRecipeGloballyAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const recipe = formData.get('recipe') as string;
    const updatedRecipe = formData.get('updatedRecipe') as string;

    if (recipe && updatedRecipe && recipe !== updatedRecipe) {
      await renamePhotoRecipeGlobally(recipe, updatedRecipe);
      revalidatePhotosKey();
      revalidateRecipesKey();
      redirect(PATH_ADMIN_RECIPES);
    }
  });

export const deleteUploadsAction = async (urls: string[]) =>
  runAuthenticatedAdminServerAction(async () => {
    await Promise.all(urls.map(url => deleteFile(url)));
    revalidateAdminPaths();
  });

// Accessed from admin photo edit page
// will not update blur data
export const getExifDataAction = async (
  url: string,
): Promise<Partial<PhotoFormData>> =>
  runAuthenticatedAdminServerAction(async () => {
    const { formDataFromExif } = await extractImageDataFromBlobPath(url);
    if (formDataFromExif) {
      return formDataFromExif;
    } else {
      return {};
    }
  });

// Accessed from admin photo table, will:
// - update EXIF data
// - anonymize storage url if necessary
// - strip GPS data if necessary
// - update blur data (or destroy if blur is disabled)
// - generate AI text data, if enabled, and auto-generated fields are empty
export const syncPhotoAction = async (photoId: string, isBatch?: boolean) =>
  runAuthenticatedAdminServerAction(async () => {
    const photo = await getPhoto(photoId ?? '', true);

    if (photo) {
      const {
        formDataFromExif,
        imageResizedBase64,
        shouldStripGpsData,
        fileBytes,
      } = await extractImageDataFromBlobPath(photo.url, {
        includeInitialPhotoFields: false,
        generateBlurData: BLUR_ENABLED,
        generateResizedImage: AI_TEXT_GENERATION_ENABLED,
      });

      let urlToDelete: string | undefined;
      if (formDataFromExif) {
        if (photo.url.includes(photo.id) || shouldStripGpsData) {
          // Anonymize storage url on update if necessary by
          // re-running image upload transfer logic
          const url = await convertUploadToPhoto({
            urlOrigin: photo.url,
            fileBytes,
            shouldStripGpsData,
            shouldDeleteOrigin: false,
          });
          if (url) {
            urlToDelete = photo.url;
            photo.url = url;
          }
        }

        const {
          title: atTitle,
          caption: aiCaption,
          tags: aiTags,
          semanticDescription: aiSemanticDescription,
        } = await generateAiImageQueries(
          imageResizedBase64,
          photo.syncStatus.missingAiTextFields,
          undefined,
          isBatch,
        );

        const formDataFromPhoto = convertPhotoToFormData(photo);

        // Don't overwrite manually configured fujifilm meta with null data
        FIELDS_TO_NOT_OVERWRITE_WITH_NULL_DATA_ON_SYNC.forEach(field => {
          if (!formDataFromExif[field] && formDataFromPhoto[field]) {
            delete formDataFromExif[field];
          }
        });

        const photoFormDbInsert =
          await convertFormDataToPhotoDbInsertAndLookupRecipeTitle({
            ...formDataFromPhoto,
            ...formDataFromExif,
            ...!BLUR_ENABLED && { blurData: undefined },
            ...!photo.title && { title: atTitle },
            ...!photo.caption && { caption: aiCaption },
            ...photo.tags.length === 0 && { tags: aiTags },
            ...!photo.semanticDescription &&
              { semanticDescription: aiSemanticDescription },
          });

        await updatePhoto(photoFormDbInsert)
          .then(async () => {
            if (urlToDelete) { await deleteFile(urlToDelete); }
          });

        revalidateAllKeysAndPaths();
      }
    }
  });

export const syncPhotosAction = async (photoIds: string[]) =>
  runAuthenticatedAdminServerAction(async () => {
    for (const photoId of photoIds) {
      await syncPhotoAction(photoId, true);
    }
    revalidateAllKeysAndPaths();
  });

export const clearCacheAction = async () =>
  runAuthenticatedAdminServerAction(revalidateAllKeysAndPaths);

export const streamAiImageQueryAction = async (
  imageBase64: string,
  query: AiImageQuery,
  existingTitle?: string,
) =>
  runAuthenticatedAdminServerAction(async () => {
    const existingTags = await getUniqueTags();
    return streamOpenAiImageQuery(
      imageBase64,
      getAiImageQuery(query, existingTags, existingTitle),
    );
  });

export const getImageBlurAction = async (url: string) =>
  runAuthenticatedAdminServerAction(() => blurImageFromUrl(url));

// Public/Private actions

export const getPhotosAction = async (
  options: GetPhotosOptions,
  warmOnly?: boolean,
) => {
  if (warmOnly) {
    return [];
  } else {
    return areOptionsSensitive(options)
      ? runAuthenticatedAdminServerAction(() => getPhotos(options))
      : getPhotos(options);
  }
};

export const getPhotosCachedAction = async (
  options: GetPhotosOptions,
  warmOnly?: boolean,
) => {
  if (warmOnly) {
    return [];
  } else {
    return areOptionsSensitive(options)
      ? runAuthenticatedAdminServerAction(() => getPhotosCached(options))
      : getPhotosCached(options);
  }
};

// Public actions

export const searchPhotosAction = async (query: string) =>
  getPhotos({ query, limit: 10 })
    .catch(e => {
      console.error('Could not query photos', e);
      return [] as Photo[];
    });
