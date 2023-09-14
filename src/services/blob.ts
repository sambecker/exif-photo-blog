import { BLOB_BASE_URL } from '@/site';
import { ROUTE_ADMIN_UPLOAD_BLOB_HANDLER } from '@/site/routes';
import { del, list, put } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

export const ACCEPTED_PHOTO_FILE_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
];

const PREFIX_UPLOAD = 'upload';
const PREFIX_PHOTO = 'photo';

const REGEX_ID = new RegExp(
  `\/(?:${PREFIX_UPLOAD}|${PREFIX_PHOTO})-([a-z0-9]+)\.[a-z]{1,4}`,
  'i',
);

const REGEX_UPLOAD_PATH = new RegExp(
  `(?:${PREFIX_UPLOAD})\.[a-z]{1,4}`,
  'i',
);

export const pathForBlobUrl = (url: string) =>
  url.replace(`${BLOB_BASE_URL}/`, '');

export const getIdFromBlobUrl = (url: string) =>
  url.match(REGEX_ID)?.[1];

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
      handleUploadUrl: ROUTE_ADMIN_UPLOAD_BLOB_HANDLER,
    },
  );

export const convertUploadToPhoto = async (
  uploadUrl: string,
  photoId: string,
) => {
  const file = await fetch(uploadUrl)
    .then((response) => response.blob());

  if (file) {
    const { url } = await put(
      `${PREFIX_PHOTO}-${photoId}.${uploadUrl.split('.').pop()}`,
      file,
      {
        access: 'public',
        addRandomSuffix: false,
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
