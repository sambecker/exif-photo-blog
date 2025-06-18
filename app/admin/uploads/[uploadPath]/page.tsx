import { PARAM_UPLOAD_TITLE, PATH_ADMIN } from '@/app/paths';
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
  AI_TEXT_GENERATION_ENABLED,
  BLUR_ENABLED,
} from '@/app/config';
import ErrorNote from '@/components/ErrorNote';
import { getRecipeTitleForData } from '@/photo/db/query';

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
    formDataFromExif,
    imageResizedBase64: imageThumbnailBase64,
    shouldStripGpsData,
    error,
  } = await extractImageDataFromBlobPath(uploadPath, {
    includeInitialPhotoFields: true,
    generateBlurData: BLUR_ENABLED,
    generateResizedImage: AI_TEXT_GENERATION_ENABLED,
  });

  const isDataMissing =
    !formDataFromExif ||
    (AI_TEXT_GENERATION_ENABLED && !imageThumbnailBase64);

  if (isDataMissing && !error) {
    // Only redirect if there's no error to report
    redirect(PATH_ADMIN);
  }

  const [
    uniqueTags,
    uniqueRecipes,
    uniqueFilms,
    recipeTitle,
  ] = await Promise.all([
    getUniqueTagsCached(),
    getUniqueRecipesCached(),
    getUniqueFilmsCached(),
    formDataFromExif?.recipeData && formDataFromExif.film
      ? getRecipeTitleForData(
        formDataFromExif.recipeData,
        formDataFromExif.film,
      )
      : undefined,
  ]);

  const hasAiTextGeneration = AI_TEXT_GENERATION_ENABLED;
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
