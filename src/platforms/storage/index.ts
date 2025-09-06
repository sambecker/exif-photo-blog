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
  HAS_MINIO_STORAGE,
} from '@/app/config';
import { generateNanoid } from '@/utility/nanoid';
import {
  CLOUDFLARE_R2_BASE_URL_PUBLIC,
  cloudflareR2Copy,
  cloudflareR2Delete,
  cloudflareR2List,
  cloudflareR2Put,
  isUrlFromCloudflareR2,
} from './cloudflare-r2';
import {
  MINIO_BASE_URL,
  minioCopy,
  minioDelete,
  minioList,
  minioPut,
  isUrlFromMinio,
} from './minio';
import { PATH_API_PRESIGNED_URL } from '@/app/path';

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
  'cloudflare-r2' |
  'minio';

export const generateStorageId = () => generateNanoid(16);

export const generateFileNameWithId = (prefix: string) =>
  `${prefix}-${generateStorageId()}`;

export const getFileNamePartsFromStorageUrl = (url: string) => {
  const [
    _,
    urlBase = '',
    fileName = '',
    fileNameBase = '',
    fileId = '',
    fileExtension = '',
  ] = url.match(/^(.+)\/((-*[a-z0-9]+-*([a-z0-9-]+))\.([a-z]{1,4}))$/i) ?? [];
  return {
    urlBase,
    fileName,
    fileNameBase,
    fileId,
    fileExtension,
  };
};

export const labelForStorage = (type: StorageType): string => {
  switch (type) {
    case 'vercel-blob': return 'Vercel Blob';
    case 'cloudflare-r2': return 'Cloudflare R2';
    case 'aws-s3': return 'AWS S3';
    case 'minio': return 'MinIO';
  }
};

export const baseUrlForStorage = (type: StorageType) => {
  switch (type) {
    case 'vercel-blob': return VERCEL_BLOB_BASE_URL;
    case 'cloudflare-r2': return CLOUDFLARE_R2_BASE_URL_PUBLIC;
    case 'aws-s3': return AWS_S3_BASE_URL;
    case 'minio': return MINIO_BASE_URL;
  }
};

export const storageTypeFromUrl = (url: string): StorageType => {
  if (isUrlFromCloudflareR2(url)) {
    return 'cloudflare-r2';
  } else if (isUrlFromAwsS3(url)) {
    return 'aws-s3';
  } else if (isUrlFromMinio(url)) {
    return 'minio';
  } else {
    return 'vercel-blob';
  }
};

export const uploadFromClientViaPresignedUrl = async (
  file: File | Blob,
  fileNameBase: string,
  extension: string,
  addRandomSuffix?: boolean,
) => {
  const key = addRandomSuffix
    ? `${fileNameBase}-${generateStorageId()}.${extension}`
    : `${fileNameBase}.${extension}`;

  const url = await fetch(`${PATH_API_PRESIGNED_URL}/${key}`)
    .then((response) => response.text());

  return fetch(url, { method: 'PUT', body: file })
    .then(() => `${baseUrlForStorage(CURRENT_STORAGE)}/${key}`);
};

export const uploadFileFromClient = async (
  file: File | Blob,
  fileNameBase: string,
  extension: string,
) => (
  CURRENT_STORAGE === 'cloudflare-r2' ||
  CURRENT_STORAGE === 'aws-s3' ||
  CURRENT_STORAGE === 'minio'
)
  ? uploadFromClientViaPresignedUrl(file, fileNameBase, extension, true)
  : vercelBlobUploadFromClient(file, `${fileNameBase}.${extension}`);

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
    case 'minio':
      return minioPut(file, fileName);
  }
};

export const copyFile = (
  originUrl: string,
  destinationFileName: string,
): Promise<string> => {
  const { fileName } = getFileNamePartsFromStorageUrl(originUrl);
  switch (storageTypeFromUrl(originUrl)) {
    case 'vercel-blob':
      return vercelBlobCopy(
        originUrl,
        destinationFileName,
        false,
      );
    case 'cloudflare-r2':
      return cloudflareR2Copy(
        fileName,
        destinationFileName,
        false,
      );
    case 'aws-s3':
      return awsS3Copy(
        originUrl,
        destinationFileName,
        false,
      );
    case 'minio':
      return minioCopy(
        fileName,
        destinationFileName,
        false,
      );
  }
};

export const deleteFile = (url: string) => {
  const { fileName } = getFileNamePartsFromStorageUrl(url);
  switch (storageTypeFromUrl(url)) {
    case 'vercel-blob':
      return vercelBlobDelete(url);
    case 'cloudflare-r2':
      return cloudflareR2Delete(fileName);
    case 'aws-s3':
      return awsS3Delete(fileName);
    case 'minio':
      return minioDelete(fileName);
  }
};

export const deleteFilesWithPrefix = async (prefix: string) => {
  const urls = await getStorageUrlsForPrefix(prefix);
  return Promise.all(urls.map(({ url }) => deleteFile(url)));
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

export const getStorageUrlsForPrefix = async (prefix = '') => {
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
  if (HAS_MINIO_STORAGE) {
    urls.push(...await minioList(prefix)
      .catch(() => []));
  }

  return urls
    .sort((a, b) => {
      if (!a.uploadedAt) { return 1; }
      if (!b.uploadedAt) { return -1; }
      return b.uploadedAt.getTime() - a.uploadedAt.getTime();
    });
};

export const testStorageConnection = () =>
  getStorageUrlsForPrefix();
