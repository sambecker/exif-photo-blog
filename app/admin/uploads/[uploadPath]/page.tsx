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
  AI_CONTENT_GENERATION_ENABLED,
  BLUR_ENABLED,
} from '@/app/config';
import ErrorNote from '@/components/ErrorNote';
import { getRecipeTitleForData } from '@/photo/query';
import { getAlbumsWithMeta } from '@/album/query';
import { addAiTextToFormData } from '@/photo/ai/server';
import AppGrid from '@/components/AppGrid';

export const maxDuration = 60;

interface Params {
  params: Promise<{ uploadPath: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function UploadPage({ params, searchParams }: Params) {
  const uploadPath = (await params).uploadPath;
  const title = (await searchParams)[PARAM_UPLOAD_TITLE];

  const [
    albums,
    uniqueRecipes,
    uniqueFilms,
    uniqueTags, {
      blobId,
      formDataFromExif: _formDataFromExif,
      imageResizedBase64: imageThumbnailBase64,
      shouldStripGpsData,
      error,
    }] = await Promise.all([
    getAlbumsWithMeta(),
    getUniqueRecipesCached(),
    getUniqueFilmsCached(),
    getUniqueTagsCached(),
    extractImageDataFromBlobPath(uploadPath, {
      includeInitialPhotoFields: true,
      generateBlurData: BLUR_ENABLED,
      generateResizedImage: AI_CONTENT_GENERATION_ENABLED,
    }),
  ]);

  const isDataMissing =
    !_formDataFromExif ||
    (AI_CONTENT_GENERATION_ENABLED && !imageThumbnailBase64);

  if (isDataMissing && !error) {
    // Only redirect if there's no error to report
    redirect(PATH_ADMIN);
  }

  const [
    recipeTitle,
    formDataFromExif,
  ] = await Promise.all([
    _formDataFromExif?.recipeData && _formDataFromExif.film
      ? getRecipeTitleForData(
        _formDataFromExif.recipeData, 
        _formDataFromExif.film,
      )
      : undefined,
    addAiTextToFormData({
      formData: _formDataFromExif,
      imageBase64: imageThumbnailBase64,
      uniqueTags,
    }),
  ]);

  const hasAiTextGeneration = AI_CONTENT_GENERATION_ENABLED;

  if (formDataFromExif) {
    if (recipeTitle) {
      formDataFromExif.recipeTitle = recipeTitle;
    }
    if (typeof title === 'string') {
      formDataFromExif.title = title;
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
        imageThumbnailBase64,
        shouldStripGpsData,
      }} />
      : <AppGrid contentMain={
        <ErrorNote>
          {error ?? 'Unknown error'}
        </ErrorNote>
      }/>
  );
};
