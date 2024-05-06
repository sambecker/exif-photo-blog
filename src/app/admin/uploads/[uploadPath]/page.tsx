import { PATH_ADMIN } from '@/site/paths';
import { extractImageDataFromBlobPath } from '@/photo/server';
import { redirect } from 'next/navigation';
import { getUniqueTagsCached } from '@/photo/cache';
import UploadPageClient from '@/photo/UploadPageClient';
import {
  AI_TEXT_AUTO_GENERATED_FIELDS,
  AI_TEXT_GENERATION_ENABLED,
} from '@/site/config';

interface Params {
  params: { uploadPath: string }
}

export default async function UploadPage({ params: { uploadPath } }: Params) {
  const {
    blobId,
    photoFormExif,
    imageResizedBase64: imageThumbnailBase64,
  } = await extractImageDataFromBlobPath( uploadPath, {
    includeInitialPhotoFields: true,
    generateBlurData: true,
    generateResizedImage: true,
  });

  if (!photoFormExif || !imageThumbnailBase64) { redirect(PATH_ADMIN); }

  const uniqueTags = await getUniqueTagsCached();

  const hasAiTextGeneration = AI_TEXT_GENERATION_ENABLED;

  const textFieldsToAutoGenerate = AI_TEXT_AUTO_GENERATED_FIELDS;

  return (
    <UploadPageClient {...{
      blobId,
      photoFormExif,
      uniqueTags,
      hasAiTextGeneration,
      textFieldsToAutoGenerate,
      imageThumbnailBase64,
    }} />
  );
};
