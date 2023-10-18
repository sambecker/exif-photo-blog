import { PATH_ADMIN_UPLOAD_BLOB } from '@/site/paths';
import { copy, del, list } from '@vercel/blob';
import { upload } from '@vercel/blob/client';

const STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();

export const BLOB_BASE_URL =
  `https://${STORE_ID}.public.blob.vercel-storage.com`;

const PREFIX_UPLOAD = 'upload';
const PREFIX_PHOTO = 'photo';

const REGEX_UPLOAD_PATH = new RegExp(
  `(?:${PREFIX_UPLOAD})\.[a-z]{1,4}`,
  'i',
);

const REGEX_UPLOAD_ID = new RegExp(
  `.${PREFIX_UPLOAD}-([a-z0-9]+)\.[a-z]{1,4}$`,
  'i',
);

export const pathForBlobUrl = (url: string) =>
  url.replace(`${BLOB_BASE_URL}/`, '');

export const getExtensionFromBlobUrl = (url: string) =>
  url.match(/.([a-z]{1,4})$/i)?.[1];

export const getIdFromBlobUrl = (url: string) =>
  url.match(REGEX_UPLOAD_ID)?.[1];

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
      handleUploadUrl: PATH_ADMIN_UPLOAD_BLOB,
    },
  );

export const convertUploadToPhoto = async (
  uploadUrl: string,
  photoId?: string,
) => {
  const fileName = photoId ? `${PREFIX_PHOTO}-${photoId}` : `${PREFIX_PHOTO}`;
  const fileExtension = getExtensionFromBlobUrl(uploadUrl) ?? 'jpg';
  const photoUrl = `${fileName}.${fileExtension ?? 'jpg'}`;

  const { url } = await copy(
    uploadUrl,
    photoUrl,
    {
      access: 'public',
      ...photoId && { addRandomSuffix: false },
    }
  );

  if (url) {
    await del(uploadUrl);
  }

  return url;
};

export const deleteBlobPhoto = (url: string) => del(url);

export const getBlobUploadUrls = () =>
  list({ prefix: `${PREFIX_UPLOAD}-` })
    .then(({ blobs }) => blobs.map(({ url }) => url));

export const getBlobPhotoUrls = () =>
  list({ prefix: `${PREFIX_PHOTO}-` })
    .then(({ blobs }) => blobs.map(({ url }) => url));
