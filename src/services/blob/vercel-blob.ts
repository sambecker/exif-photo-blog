import { PATH_ADMIN_UPLOAD_BLOB } from '@/site/paths';
import { copy, del, list } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

const VERCEL_BLOB_STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();

export const VERCEL_BLOB_BASE_URL =
  `https://${VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com`;

export const vercelBlobUploadFromClient = async (
  file: File | Blob,
  fileName: string,
) =>
  upload(
    fileName,
    file,
    {
      access: 'public',
      handleUploadUrl: PATH_ADMIN_UPLOAD_BLOB,
    },
  )
    .then(({ url }) => url);

export const vercelBlobCopy = (
  fileNameSource: string,
  fileNameDestination: string,
  addRandomSuffix?: boolean,
): Promise<string> =>
  copy(
    fileNameSource,
    fileNameDestination,
    {
      access: 'public',
      addRandomSuffix,
    },
  )
    .then(({ url }) => url);

export const vercelBlobDelete = (fileName: string) => del(fileName);

export const vercelBlobList = (prefix: string) => list({ prefix })
  .then(({ blobs }) => blobs.map(({ url }) => url));
