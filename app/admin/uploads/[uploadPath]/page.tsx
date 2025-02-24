import { PATH_ADMIN } from '@/app/paths';
import { extractImageDataFromBlobPath } from '@/photo/server';
import { redirect } from 'next/navigation';
import { getUniqueTagsCached } from '@/photo/cache';
import UploadPageClient from '@/photo/UploadPageClient';
import {
  AI_TEXT_AUTO_GENERATED_FIELDS,
  AI_TEXT_GENERATION_ENABLED,
  BLUR_ENABLED,
} from '@/app/config';
import ErrorNote from '@/components/ErrorNote';

export const maxDuration = 60;

interface Params {
  params: Promise<{ uploadPath: string }>
}

export default async function UploadPage({ params }: Params) {
  const { uploadPath } = await params;

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

  const uniqueTags = await getUniqueTagsCached();

  const hasAiTextGeneration = AI_TEXT_GENERATION_ENABLED;

  const textFieldsToAutoGenerate = AI_TEXT_AUTO_GENERATED_FIELDS;

  return (
    !isDataMissing
      ? <UploadPageClient {...{
        blobId,
        formDataFromExif,
        uniqueTags,
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
