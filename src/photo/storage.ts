import {
  copyFile,
  deleteFile,
  generateRandomFileNameForPhoto,
  getExtensionFromStorageUrl,
  getFileNamePartsFromStorageUrl,
  getPhotoFileName,
  moveFile,
  putFile,
} from '@/platforms/storage';
import { removeGpsData, resizeImageToBytes } from './server';

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
  const photoPathOptimized = getPhotoFileName(fileName, fileExtension, true);
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
    await putFile(await resizeImageToBytes(fileBytes), photoPathOptimized);
    return url;
  });
};

export const getOrCreatedOptimizedPhotoUrl = async (url: string) => {
  const {
    fileNameOptimized,
    urlOptimized,
  } = getFileNamePartsFromStorageUrl(url);
  const doesUrlExist = await fetch(urlOptimized).then(res => res.ok);
  if (!doesUrlExist) {
    console.log('GENERATING JIT OPTIMIZED PHOTO', urlOptimized);
    const fileBytes = await fetch(url).then(res => res.arrayBuffer());
    const optimizedFileBytes = await resizeImageToBytes(fileBytes);
    await putFile(optimizedFileBytes, fileNameOptimized);
  }
  return urlOptimized;
};
