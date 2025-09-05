import { NextImageSize } from '@/platforms/next-image';
import {
  generateFileNameWithId,
  getFileNamePartsFromStorageUrl,
  getStorageUrlsForPrefix,
  uploadFileFromClient,
} from '@/platforms/storage';

const PREFIX_PHOTO = 'photo';
const PREFIX_UPLOAD = 'upload';

const EXTENSION_DEFAULT = 'jpg';
const EXTENSION_OPTIMIZED = 'jpg';

// For the time being, make compatible with `next/image` sizes
const OPTIMIZED_FILE_SIZES = [{
  suffix: 'sm',
  size: 200,
}, {
  suffix: 'md',
  size: 640,
}, {
  suffix: 'lg',
  size: 1080,
}] as const satisfies {
  suffix: string
  size: NextImageSize
}[];

export type OptimizedSize = (typeof OPTIMIZED_FILE_SIZES)[number]['suffix'];

export const getOptimizedPhotoFileMeta = (fileName: string) =>
  OPTIMIZED_FILE_SIZES.map(({ suffix, size }) => ({
    size,
    fileName: `${fileName}-${suffix}.${EXTENSION_OPTIMIZED}`,
  }));

export const getOptimizedFileNamesFromPhotoUrl = (url: string) => {
  const { urlBase, fileName } = getFileNamePartsFromStorageUrl(url);
  return getOptimizedPhotoFileMeta(fileName).map(({ fileName }) =>
    `${urlBase}/${fileName}`);
};

export const isUploadPathnameValid = (pathname?: string) =>
  pathname?.match(new RegExp(`(?:${PREFIX_UPLOAD})\.[a-z]{1,4}`, 'i'));

export const generateRandomFileNameForPhoto = () =>
  generateFileNameWithId(PREFIX_PHOTO);

export const getStorageUploadUrls = () =>
  getStorageUrlsForPrefix(`${PREFIX_UPLOAD}-`);

export const getStoragePhotoUrls = () =>
  getStorageUrlsForPrefix(`${PREFIX_PHOTO}-`);

export const uploadPhotoFromClient = (
  file: File | Blob,
  extension = EXTENSION_DEFAULT,
) =>
  uploadFileFromClient(file, PREFIX_UPLOAD, extension);
