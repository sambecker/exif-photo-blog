import {
  VERCEL_BLOB_BASE_URL,
  vercelBlobCopy,
  vercelBlobDelete,
  vercelBlobList,
  vercelBlobPut,
  vercelBlobUploadFromClient,
} from './vercel-blob';
import {
  AWS_S3_BASE_URL,
  awsS3Copy,
  awsS3Delete,
  awsS3List,
  awsS3Put,
  isUrlFromAwsS3,
} from './aws-s3';
import {
  CURRENT_STORAGE,
  HAS_AWS_S3_STORAGE,
  HAS_VERCEL_BLOB_STORAGE,
  HAS_CLOUDFLARE_R2_STORAGE,
} from '@/app/config';
import { generateStorageId } from '@/utility/nanoid';
import {
  CLOUDFLARE_R2_BASE_URL_PUBLIC,
  CLOUDFLARE_R2_WEB_BASE_URL_PUBLIC,
  HAS_CLOUDFLARE_R2_WEB_BUCKET,
  cloudflareR2Copy,
  cloudflareR2Delete,
  cloudflareR2List,
  cloudflareR2Put,
  isUrlFromCloudflareR2,
  isUrlFromCloudflareR2Web,
} from './cloudflare-r2';
import { PATH_API_PRESIGNED_URL } from '@/app/path';

// Re-exported from `@/utility/nanoid` so provider modules can import it
// without pulling in this heavy storage barrel.
export { generateStorageId };

export type StorageListItem = {
  url: string
  fileName: string
  uploadedAt?: Date
  size?: string
};

export type StorageListResponse = StorageListItem[];

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

export const baseUrlForStorage = (type: StorageType) => {
  switch (type) {
    case 'vercel-blob': return VERCEL_BLOB_BASE_URL;
    case 'cloudflare-r2': return CLOUDFLARE_R2_BASE_URL_PUBLIC;
    case 'aws-s3': return AWS_S3_BASE_URL;
  }
};

export const storageTypeFromUrl = (url: string): StorageType => {
  if (isUrlFromCloudflareR2(url)) {
    return 'cloudflare-r2';
  } else if (isUrlFromAwsS3(url)) {
    return 'aws-s3';
  } else {
    return 'vercel-blob';
  }
};

const PREFIX_UPLOAD = 'upload';
const PREFIX_PHOTO = 'photo';

export const generateRandomFileNameForPhoto = () =>
  `${PREFIX_PHOTO}-${generateStorageId()}`;

const REGEX_UPLOAD_PATH = new RegExp(
  `(?:${PREFIX_UPLOAD})\.[a-z]{1,4}`,
  'i',
);

const REGEX_UPLOAD_ID = new RegExp(
  `.${PREFIX_UPLOAD}-([a-z0-9]+)\.[a-z]{1,4}$`,
  'i',
);

export const fileNameForStorageUrl = (url: string) => {
  switch (storageTypeFromUrl(url)) {
    case 'vercel-blob':
      return url.replace(`${VERCEL_BLOB_BASE_URL}/`, '');
    case 'cloudflare-r2':
      return isUrlFromCloudflareR2Web(url)
        ? url.replace(`${CLOUDFLARE_R2_WEB_BASE_URL_PUBLIC}/`, '')
        : url.replace(`${CLOUDFLARE_R2_BASE_URL_PUBLIC}/`, '');
    case 'aws-s3':
      return url.replace(`${AWS_S3_BASE_URL}/`, '');
  }
};

export const getExtensionFromStorageUrl = (url: string) =>
  url.match(/.([a-z]{1,4})$/i)?.[1];

export const getIdFromStorageUrl = (url: string) =>
  url.match(REGEX_UPLOAD_ID)?.[1];

export const isUploadPathnameValid = (pathname?: string) =>
  pathname?.match(REGEX_UPLOAD_PATH);

const getFileNameFromStorageUrl = (url: string) =>
  (new URL(url).pathname.match(/\/(.+)$/)?.[1]) ?? '';

// Which R2 bucket a presigned upload targets. `web` routes to the public,
// low-res bucket (`parker-web`); omitted/`private` keeps today's behavior.
export type CloudflareR2UploadBucket = 'private' | 'web';

export const uploadFromClientViaPresignedUrl = async (
  file: File | Blob,
  fileName: string,
  extension: string,
  addRandomSuffix?: boolean,
  storageType?: StorageType,
  r2Bucket?: CloudflareR2UploadBucket,
) => {
  const key = addRandomSuffix
    ? `${fileName}-${generateStorageId()}.${extension}`
    : `${fileName}.${extension}`;

  const searchParams = new URLSearchParams();
  if (storageType) { searchParams.set('storage', storageType); }
  if (r2Bucket === 'web') { searchParams.set('bucket', 'web'); }
  const queryString = searchParams.toString();

  const response = await fetch(
    `${PATH_API_PRESIGNED_URL}/${key}${queryString ? `?${queryString}` : ''}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get presigned URL: ${errorText || response.statusText}`,
    );
  }

  const url = await response.text();

  // Web-bucket uploads resolve to the public CDN domain; everything else keeps
  // the existing base-URL resolution.
  const baseUrl = r2Bucket === 'web' && CLOUDFLARE_R2_WEB_BASE_URL_PUBLIC
    ? CLOUDFLARE_R2_WEB_BASE_URL_PUBLIC
    : baseUrlForStorage(storageType || CURRENT_STORAGE);

  return fetch(url, { method: 'PUT', body: file })
    .then(() => `${baseUrl}/${key}`);
};

export const uploadPhotoFromClient = async (
  file: File | Blob,
  extension = 'jpg',
) =>
  // Route low-res grid images to the public web bucket (`parker-web`) whenever
  // it is configured — independent of `NEXT_PUBLIC_STORAGE_PREFERENCE` — so a
  // misconfigured preference can't send low-res images to the private bucket.
  // When the web bucket is unset, fall back to today's behavior.
  HAS_CLOUDFLARE_R2_WEB_BUCKET
    ? uploadFromClientViaPresignedUrl(
      file,
      PREFIX_UPLOAD,
      extension,
      true,
      'cloudflare-r2',
      'web',
    )
    : (
      CURRENT_STORAGE === 'cloudflare-r2' ||
      CURRENT_STORAGE === 'aws-s3'
    )
      ? uploadFromClientViaPresignedUrl(file, PREFIX_UPLOAD, extension, true)
      : vercelBlobUploadFromClient(file, `${PREFIX_UPLOAD}.${extension}`);

export const uploadHighResPhotoFromClient = async (
  file: File | Blob,
  extension = 'jpg',
) => uploadFromClientViaPresignedUrl(
  file,
  PREFIX_UPLOAD,
  extension,
  true,
  'cloudflare-r2',
  // High-res originals always stay in the private bucket (`parker`)
  'private',
);

export const putFile = (
  file: Buffer,
  fileName: string,
) => {
  switch (CURRENT_STORAGE) {
    case 'vercel-blob':
      return vercelBlobPut(file, fileName);
    case 'cloudflare-r2':
      return cloudflareR2Put(file, fileName);
    case 'aws-s3':
      return awsS3Put(file, fileName);
  }
};

export const copyFile = (
  originUrl: string,
  destinationFileName: string,
): Promise<string> => {
  switch (storageTypeFromUrl(originUrl)) {
    case 'vercel-blob':
      return vercelBlobCopy(
        originUrl,
        destinationFileName,
        false,
      );
    case 'cloudflare-r2':
      return cloudflareR2Copy(
        getFileNameFromStorageUrl(originUrl),
        destinationFileName,
        false,
        isUrlFromCloudflareR2Web(originUrl) ? 'web' : 'private',
      );
    case 'aws-s3':
      return awsS3Copy(
        originUrl,
        destinationFileName,
        false,
      );
  }
};

export const deleteFile = (url: string) => {
  switch (storageTypeFromUrl(url)) {
    case 'vercel-blob':
      return vercelBlobDelete(url);
    case 'cloudflare-r2':
      return cloudflareR2Delete(
        getFileNameFromStorageUrl(url),
        isUrlFromCloudflareR2Web(url) ? 'web' : 'private',
      );
    case 'aws-s3':
      return awsS3Delete(getFileNameFromStorageUrl(url));
  }
};

export const moveFile = async (
  originUrl: string,
  destinationFileName: string,
) => {
  const url = await copyFile(originUrl, destinationFileName);
  // If successful, delete original file
  if (url) { await deleteFile(originUrl); }
  return url;
};

const getStorageUrlsForPrefix = async (prefix = '') => {
  const urls: StorageListResponse = [];

  if (HAS_VERCEL_BLOB_STORAGE) {
    urls.push(...await vercelBlobList(prefix)
      .catch(() => []));
  }
  if (HAS_AWS_S3_STORAGE) {
    urls.push(...await awsS3List(prefix)
      .catch(() => []));
  }
  if (HAS_CLOUDFLARE_R2_STORAGE) {
    urls.push(...await cloudflareR2List(prefix)
      .catch(() => []));
  }

  return urls
    .sort((a, b) => {
      if (!a.uploadedAt) { return 1; }
      if (!b.uploadedAt) { return -1; }
      return b.uploadedAt.getTime() - a.uploadedAt.getTime();
    });
};

export const getStorageUploadUrls = () =>
  getStorageUrlsForPrefix(`${PREFIX_UPLOAD}-`);

export const getStoragePhotoUrls = () =>
  getStorageUrlsForPrefix(`${PREFIX_PHOTO}-`);

export const testStorageConnection = () =>
  getStorageUrlsForPrefix();
