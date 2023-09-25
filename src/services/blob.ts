import { PATH_ADMIN_UPLOAD_BLOB_HANDLER } from '@/site/paths';
import { del, list, put } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

const STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();

export const BLOB_BASE_URL =
  `https://${STORE_ID}.public.blob.vercel-storage.com`;

const PREFIX_UPLOAD = 'upload';
const PREFIX_PHOTO = 'photo';

export const ACCEPTED_PHOTO_FILE_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
];

const REGEX_UPLOAD_PATH = new RegExp(
  `(?:${PREFIX_UPLOAD})\.[a-z]{1,4}`,
  'i',
);

export const pathForBlobUrl = (url: string) =>
  url.replace(`${BLOB_BASE_URL}/`, '');

export const getExtensionFromBlobUrl = (url: string) =>
  url.match(/.([a-z]{1,4})$/i)?.[1];

export const isUploadPathnameValid = (pathname?: string) =>
  pathname?.match(REGEX_UPLOAD_PATH);

export const uploadPhotoFromClient = async (
  file: File | Blob,
  extension = 'jpg',
) =>
  upload(
    `${PREFIX_UPLOAD}.${extension}`,
    file,
    {
      access: 'public',
      handleUploadUrl: PATH_ADMIN_UPLOAD_BLOB_HANDLER,
    },
  );

export const convertUploadToPhoto = async (
  uploadUrl: string,
  photoId?: string,
  resizeUrl?: string,
  resizeExtension?: string
) => {
  const file = await fetch(resizeUrl ?? uploadUrl)
    .then((response) => response.blob());

  const fileName = photoId ? `${PREFIX_PHOTO}-${photoId}` : `${PREFIX_PHOTO}`;
  const fileExtension = resizeExtension ?? getExtensionFromBlobUrl(uploadUrl);

  if (file) {
    const { url } = await put(
      `${fileName}.${fileExtension ?? 'jpg'}`,
      file,
      {
        access: 'public',
        ...photoId && { addRandomSuffix: false },
      }
    );

    if (url) {
      await del(uploadUrl);
    }

    return url;
  }
};

export const deleteBlobPhoto = (url: string) => del(url);

export const getBlobUploadUrls = () =>
  list({ prefix: `${PREFIX_UPLOAD}-` })
    .then(({ blobs }) => blobs.map(({ url }) => url));

export const getBlobPhotoUrls = () =>
  list({ prefix: `${PREFIX_PHOTO}-` })
    .then(({ blobs }) => blobs.map(({ url }) => url));
