import {
  VERCEL_BLOB_BASE_URL,
  vercelBlobCopy,
  vercelBlobDelete,
  vercelBlobList,
  vercelBlobUploadFromClient,
} from './vercel-blob';
import {
  AWS_S3_BASE_URL,
  awsS3Copy,
  awsS3Delete,
  awsS3List,
  isUrlFromAwsS3,
} from './aws-s3';
import {
  STORAGE_PREFERENCE,
  HAS_AWS_S3_STORAGE,
} from '@/site/config';
import { generateNanoid } from '@/utility/nanoid';
import { CLOUDFLARE_R2_BASE_URL_PUBLIC } from './cloudflare-r2';
import { PATH_API_PRESIGNED_URL } from '@/site/paths';

export const generateBlobId = () => generateNanoid(16);

export type StorageType =
  'vercel-blob' |
  'aws-s3' |
  'cloudflare-r2';

export const labelForStorage = (type: StorageType): string => {
  switch (type) {
  case 'vercel-blob': return 'Vercel Blob';
  case 'cloudflare-r2': return 'Cloudflare R2';
  case 'aws-s3': return 'AWS S3';
  }
};

const blobBaseUrlForStorage = (type: StorageType) => {
  switch (type) {
  case 'vercel-blob': return VERCEL_BLOB_BASE_URL;
  case 'cloudflare-r2': return CLOUDFLARE_R2_BASE_URL_PUBLIC;
  case 'aws-s3': return AWS_S3_BASE_URL;
  }
};

export const BLOB_BASE_URL = blobBaseUrlForStorage(STORAGE_PREFERENCE);

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

export const fileNameForBlobUrl = (url: string) =>
  url.replace(`${BLOB_BASE_URL}/`, '');

export const getExtensionFromBlobUrl = (url: string) =>
  url.match(/.([a-z]{1,4})$/i)?.[1];

export const getIdFromBlobUrl = (url: string) =>
  url.match(REGEX_UPLOAD_ID)?.[1];

export const isUploadPathnameValid = (pathname?: string) =>
  pathname?.match(REGEX_UPLOAD_PATH);

const getFileNameFromBlobUrl = (url: string) =>
  (new URL(url).pathname.match(/\/(.+)$/)?.[1]) ?? '';

export const uploadFromClientViaPresignedUrl = async (
  file: File | Blob,
  fileName: string,
  extension: string,
  addRandomSuffix?: boolean,
) => {
  const key = addRandomSuffix
    ? `${fileName}-${generateBlobId()}.${extension}`
    : `${fileName}.${extension}`;

  const url = await fetch(`${PATH_API_PRESIGNED_URL}/${key}`)
    .then((response) => response.text());

  return fetch(url, { method: 'PUT', body: file })
    .then(() => `${BLOB_BASE_URL}/${key}`);
};

export const uploadPhotoFromClient = async (
  file: File | Blob,
  extension = 'jpg',
) => (
  STORAGE_PREFERENCE === 'cloudflare-r2' ||
  STORAGE_PREFERENCE === 'aws-s3'
)
  ? uploadFromClientViaPresignedUrl(file, PREFIX_UPLOAD, extension, true)
  : vercelBlobUploadFromClient(file, `${PREFIX_UPLOAD}.${extension}`);

export const convertUploadToPhoto = async (
  uploadUrl: string,
  photoId?: string,
): Promise<string> => {
  const fileName = photoId ? `${PREFIX_PHOTO}-${photoId}` : `${PREFIX_PHOTO}`;
  const fileExtension = getExtensionFromBlobUrl(uploadUrl);
  const photoUrl = `${fileName}.${fileExtension ?? 'jpg'}`;

  const useAwsS3 = HAS_AWS_S3_STORAGE && isUrlFromAwsS3(uploadUrl);

  const url = await (useAwsS3
    ? awsS3Copy(uploadUrl, photoUrl, photoId === undefined)
    : vercelBlobCopy(uploadUrl, photoUrl, photoId === undefined));

  if (url) {
    await (useAwsS3
      ? awsS3Delete(getFileNameFromBlobUrl(uploadUrl))
      : vercelBlobDelete(uploadUrl));
  }

  return url;
};

export const deleteBlobUrl = (url: string) =>
  HAS_AWS_S3_STORAGE && isUrlFromAwsS3(url)
    ? awsS3Delete(getFileNameFromBlobUrl(url))
    : vercelBlobDelete(url);

export const getBlobUploadUrls = (): Promise<string[]> => HAS_AWS_S3_STORAGE
  ? awsS3List(`${PREFIX_UPLOAD}-`)
  : vercelBlobList(`${PREFIX_UPLOAD}-`);

export const getBlobPhotoUrls = (): Promise<string[]> => HAS_AWS_S3_STORAGE
  ? awsS3List(`${PREFIX_PHOTO}-`)
  : vercelBlobList(`${PREFIX_PHOTO}-`);
