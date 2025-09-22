import { PARAM_UPLOAD_TITLE, PATH_ADMIN } from '@/app/path';
import { extractImageDataFromBlobPath } from '@/photo/server';
import { redirect } from 'next/navigation';
import {
  getUniqueFilmsCached,
  getUniqueRecipesCached,
  getUniqueTagsCached,
} from '@/photo/cache';
import UploadPageClient from '@/photo/UploadPageClient';
import {
  AI_TEXT_AUTO_GENERATED_FIELDS,
  AI_CONTENT_GENERATION_ENABLED,
  BLUR_ENABLED,
} from '@/app/config';
import ErrorNote from '@/components/ErrorNote';
import { getRecipeTitleForData } from '@/photo/query';
import { getAlbumsWithMeta } from '@/album/query';
import { addAiTextToFormData } from '@/photo/ai/server';

export const maxDuration = 60;

interface Params {
  params: Promise<{ uploadPath: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function UploadPage({ params, searchParams }: Params) {
  const uploadPath = (await params).uploadPath;
  const title = (await searchParams)[PARAM_UPLOAD_TITLE];

  const {
    blobId,
    formDataFromExif: _formDataFromExif,
    imageResizedBase64: imageThumbnailBase64,
    shouldStripGpsData,
    error,
  } = await extractImageDataFromBlobPath(uploadPath, {
    includeInitialPhotoFields: true,
    generateBlurData: BLUR_ENABLED,
    generateResizedImage: AI_CONTENT_GENERATION_ENABLED,
  });

  const isDataMissing =
    !_formDataFromExif ||
    (AI_CONTENT_GENERATION_ENABLED && !imageThumbnailBase64);

  if (isDataMissing && !error) {
    // Only redirect if there's no error to report
    redirect(PATH_ADMIN);
  }

  const [
    albums,
    uniqueTags,
    uniqueRecipes,
    uniqueFilms,
    recipeTitle,
    formDataFromExif,
  ] = await Promise.all([
    getAlbumsWithMeta(),
    getUniqueTagsCached(),
    getUniqueRecipesCached(),
    getUniqueFilmsCached(),
    _formDataFromExif?.recipeData && _formDataFromExif.film
      ? getRecipeTitleForData(
        _formDataFromExif.recipeData,
        _formDataFromExif.film,
      )
      : undefined,
    addAiTextToFormData(
      _formDataFromExif,
      imageThumbnailBase64,
    ),
  ]);

  const hasAiTextGeneration = AI_CONTENT_GENERATION_ENABLED;
  let textFieldsToAutoGenerate = AI_TEXT_AUTO_GENERATED_FIELDS;

  if (formDataFromExif) {
    if (recipeTitle) {
      formDataFromExif.recipeTitle = recipeTitle;
    }
    if (typeof title === 'string') {
      formDataFromExif.title = title;
      textFieldsToAutoGenerate = textFieldsToAutoGenerate
        .filter(field => field !== 'title');
    }
  }

  return (
    !isDataMissing
      ? <UploadPageClient {...{
        blobId,
        formDataFromExif,
        albums,
        uniqueTags,
        uniqueRecipes,
        uniqueFilms,
        hasAiTextGeneration,
        textFieldsToAutoGenerate,
        imageThumbnailBase64,
        shouldStripGpsData,
      }} />
      : <ErrorNote>
        {error ?? 'Unknown error'}
      </ErrorNote>
  );
};
