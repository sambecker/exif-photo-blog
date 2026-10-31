import { PhotoFormData } from './form';
import { getUniqueTags, insertPhoto } from './query';
import { Tags } from '@/tag';
import type { UrlAddStatus } from '@/admin/AdminUploadsClient';
import {
  AI_CONTENT_GENERATION_ENABLED,
  AI_TEXT_AUTO_GENERATED_FIELDS,
  BLUR_ENABLED,
  AUTO_GENERATE_LOCATIONS,
} from '@/app/config';
import {
  convertFormDataToPhotoDbInsertAndLookupRecipeTitle,
  extractImageDataFromBlobPath,
} from './server';
import { getAiTextFieldsToGenerate } from './ai';
import { generateAiImageQueries } from './ai/server';
import { convertUploadToPhoto } from './storage/server';
import { addPhotoAlbumIds } from '@/album/query';
import { revalidateAllKeysAndPaths } from '@/cache';
import { after } from 'next/server';

export const addUpload = async ({
  url,
  title: _title,
  albumIds = [],
  tags: _tags,
  favorite,
  hidden,
  excludeFromFeeds,
  takenAtLocal,
  takenAtNaiveLocal,
  uniqueTags: _uniqueTags,
  onStreamUpdate,
  onFinish,
  shouldRevalidateAllKeysAndPaths,
}:{
  url: string
  title?: string
  albumIds?: string[]
  tags?: string
  favorite?: string
  hidden?: string
  excludeFromFeeds?: string
  takenAtLocal: string
  takenAtNaiveLocal: string
  uniqueTags?: Tags
  onStreamUpdate?: (
    statusMessage: string,
    status?: UrlAddStatus['status'],
  ) => void
  onFinish?: (url: string) => void
  shouldRevalidateAllKeysAndPaths?: boolean
}) => {
  const {
    formDataFromExif,
    imageResizedBase64,
    shouldStripGpsData,
    fileBytes,
  } = await extractImageDataFromBlobPath(url, {
    includeInitialPhotoFields: true,
    generateBlurData: BLUR_ENABLED,
    generateResizedImage: AI_CONTENT_GENERATION_ENABLED,
    lookupLocation: AUTO_GENERATE_LOCATIONS,
  });

  if (formDataFromExif) {
    if (AI_CONTENT_GENERATION_ENABLED) {
      onStreamUpdate?.('Generating AI text');
    }

    const title = _title || formDataFromExif.title;
    const caption = formDataFromExif.caption;
    const tags = _tags || formDataFromExif.tags;

    const uniqueTags = _uniqueTags || await getUniqueTags();

    const {
      title: aiTitle,
      caption: aiCaption,
      tags: aiTags,
      semantic,
    } = await generateAiImageQueries({
      imageBase64: imageResizedBase64,
      textFieldsToGenerate: getAiTextFieldsToGenerate(
        AI_TEXT_AUTO_GENERATED_FIELDS,
        Boolean(title),
        Boolean(caption),
        Boolean(tags),
      ),
      existingTitle: title,
      uniqueTags,
    });

    const form: Partial<PhotoFormData> = {
      ...formDataFromExif,
      title: title || aiTitle,
      caption: caption || aiCaption,
      tags: tags || aiTags,
      excludeFromFeeds,
      hidden,
      favorite,
      semanticDescription: semantic,
      takenAt: formDataFromExif.takenAt || takenAtLocal,
      takenAtNaive: formDataFromExif.takenAtNaive || takenAtNaiveLocal,
    };

    onStreamUpdate?.('Transferring to photo storage');

    const updatedUrl = await convertUploadToPhoto({
      uploadUrl: url,
      fileBytes,
      shouldStripGpsData,
    });
    if (updatedUrl) {
      const subheadFinal = 'Adding to database';
      onStreamUpdate?.(subheadFinal);
      const photo =
        await convertFormDataToPhotoDbInsertAndLookupRecipeTitle(form);
      photo.url = updatedUrl;
      await insertPhoto(photo);
      if (albumIds.length > 0) {
        await addPhotoAlbumIds([photo.id], albumIds);
      }
      if (shouldRevalidateAllKeysAndPaths) {
        after(revalidateAllKeysAndPaths);
      }
      onFinish?.(url);
      // Re-submit with updated url
      onStreamUpdate?.(subheadFinal, 'added');
      return { id: photo.id, url: photo.url, hidden: Boolean(photo.hidden) };
    }
  }
};
