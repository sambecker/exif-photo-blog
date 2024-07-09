import { PATH_API_VERCEL_BLOB_UPLOAD } from '@/site/paths';
import { copy, del, list, put } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { fileNameForStorageUrl } from '.';

const VERCEL_BLOB_STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();

export const VERCEL_BLOB_BASE_URL = VERCEL_BLOB_STORE_ID
  ? `https://${VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com`
  : undefined;

export const isUrlFromVercelBlob = (url?: string) =>
  VERCEL_BLOB_BASE_URL &&
  url?.startsWith(VERCEL_BLOB_BASE_URL);

export const vercelBlobUploadFromClient = async (
  file: File | Blob,
  fileName: string,
): Promise<string> =>
  upload(
    fileName,
    file,
    {
      access: 'public',
      handleUploadUrl: PATH_API_VERCEL_BLOB_UPLOAD,
    },
  )
    .then(({ url }) => url);

export const vercelBlobPut = (
  file: Buffer,
  fileName: string,
): Promise<string> =>
  put(fileName, file, {
    addRandomSuffix: false,
    access: 'public',
  })
    .then(({ url }) => url);

export const vercelBlobCopy = (
  sourceUrl: string,
  destinationFileName: string,
  addRandomSuffix?: boolean,
): Promise<string> =>
  copy(
    sourceUrl,
    destinationFileName,
    {
      access: 'public',
      addRandomSuffix,
    },
  )
    .then(({ url }) => url);

export const vercelBlobDelete = (fileName: string) => del(fileName);

export const vercelBlobList = (prefix: string) => list({ prefix })
  .then(({ blobs }) => blobs.map(({ url, uploadedAt }) => ({
    url,
    fileName: fileNameForStorageUrl(url),
    uploadedAt,
  })));
