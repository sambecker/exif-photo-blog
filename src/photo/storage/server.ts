import {
  copyFile,
  deleteFile,
  generateRandomFileName,
  getFileNamePartsFromStorageUrl,
  getStorageUrlsForPrefix,
  moveFile,
  putFile,
} from '@/platforms/storage';
import { removeGpsData, resizeImageToBytes } from '../server';
import {
  PREFIX_PHOTO,
  PREFIX_UPLOAD,
  EXTENSION_DEFAULT,
  SUFFIX_OPTIMIZED_SM,
  SUFFIX_OPTIMIZED_MD,
  EXTENSION_OPTIMIZED,
  getExtensionFromStorageUrl,
} from '.';

export const generateRandomFileNameForPhoto = () =>
  generateRandomFileName(PREFIX_PHOTO);

export const getPhotoFileName = (
  fileName: string,
  extension = EXTENSION_DEFAULT,
  isOptimized?: 'sm' | 'md',
) =>
  isOptimized === 'sm'
    ? `${fileName}-${SUFFIX_OPTIMIZED_SM}.${EXTENSION_OPTIMIZED}`
    : isOptimized === 'md'
      ? `${fileName}-${SUFFIX_OPTIMIZED_MD}.${EXTENSION_OPTIMIZED}`
      : `${fileName}.${extension}`;

export const getOptimizedFileNamesFromUrl = (url: string) => {
  const {
    urlBase,
    fileNameBase,
    fileExtension,
  } = getFileNamePartsFromStorageUrl(url);
  const fileNameOptimized = getPhotoFileName(fileNameBase, fileExtension, 'sm');
  const urlOptimized = `${urlBase}/${fileNameOptimized}`;
  return {
    fileNameOptimized,
    urlOptimized,
  };
};

export const getStorageUploadUrls = () =>
  getStorageUrlsForPrefix(`${PREFIX_UPLOAD}-`);

export const getStoragePhotoUrls = () =>
  getStorageUrlsForPrefix(`${PREFIX_PHOTO}-`);

export const convertUploadToPhoto = async ({
  urlOrigin,
  fileBytes: _fileBytes,
  shouldStripGpsData,
  shouldDeleteOrigin = true,
} : {
  urlOrigin: string
  fileBytes?: ArrayBuffer
  shouldStripGpsData?: boolean
  shouldDeleteOrigin?: boolean
}) => {
  const fileName = generateRandomFileNameForPhoto();
  const fileExtension = getExtensionFromStorageUrl(urlOrigin);
  const photoPath = getPhotoFileName(fileName, fileExtension);
  const photoPathOptimized = getPhotoFileName(fileName, fileExtension, 'sm');
  const fileBytes = _fileBytes
    ? _fileBytes
    : await fetch(urlOrigin, { cache: 'no-store' })
      .then(res => res.arrayBuffer());
  let promise: Promise<string>;
  if (shouldStripGpsData) {
    const fileWithoutGps = await removeGpsData(fileBytes);
    promise = putFile(fileWithoutGps, photoPath).then(async url => {
      if (url && shouldDeleteOrigin) { await deleteFile(urlOrigin); }
      return url;
    });
  } else {
    promise = shouldDeleteOrigin
      ? moveFile(urlOrigin, photoPath)
      : copyFile(urlOrigin, photoPath);
  }
  return promise.then(async url => {
    // Store optimized photo once original photo is copied/moved
    await putFile(
      await resizeImageToBytes(fileBytes, 640),
      photoPathOptimized,
    );
    return url;
  });
};

export const getOrCreatedOptimizedPhotoUrl = async (url: string) => {
  const {
    fileNameOptimized,
    urlOptimized,
  } = getOptimizedFileNamesFromUrl(url);
  const doesUrlExist = await fetch(urlOptimized).then(res => res.ok);
  if (!doesUrlExist) {
    console.log('GENERATING JIT OPTIMIZED PHOTO', urlOptimized);
    const fileBytes = await fetch(url).then(res => res.arrayBuffer());
    const optimizedFileBytes = await resizeImageToBytes(fileBytes, 640);
    await putFile(optimizedFileBytes, fileNameOptimized);
  }
  return urlOptimized;
};
