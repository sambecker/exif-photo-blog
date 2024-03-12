import { PATH_ADMIN } from '@/site/paths';
import { extractExifDataFromBlobPath } from '@/photo/server';
import { redirect } from 'next/navigation';
import { getUniqueTagsCached } from '@/photo/cache';
import UploadPageClient from '@/photo/UploadPageClient';

interface Params {
  params: { uploadPath: string }
}

export default async function UploadPage({ params: { uploadPath } }: Params) {
  const {
    blobId,
    photoFormExif,
  } = await extractExifDataFromBlobPath(uploadPath);

  const uniqueTags = await getUniqueTagsCached();

  if (!photoFormExif) { redirect(PATH_ADMIN); }

  return (
    <UploadPageClient {...{ blobId, photoFormExif, uniqueTags }} />
  );
};
