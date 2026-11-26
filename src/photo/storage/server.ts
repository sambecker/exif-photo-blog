import {
  copyFile,
  deleteFile,
  getFileNamePartsFromStorageUrl,
  moveFile,
  putFile,
} from '@/platforms/storage';
import {
  removeGpsData,
  resizeImageToBytes,
} from '../server';
import { fetchUrlStream } from '@/utility/fetch';
import {
  generateRandomFileNameForPhoto,
  getOptimizedPhotoFileMeta,
} from '.';

export const storeOptimizedPhotosForUrl = async (url: string) => {
  const { fileNameBase } = getFileNamePartsFromStorageUrl(url);
  const optimizedPhotoFileMeta = getOptimizedPhotoFileMeta(fileNameBase);
  for (const { fileName, size, quality } of optimizedPhotoFileMeta) {
    const stream = await fetchUrlStream(url);
    await putFile(await resizeImageToBytes(stream, size, quality), fileName);
  }
  return url;
};

export const convertUploadToPhoto = async ({
  uploadUrl,
  shouldStripGpsData,
  shouldDeleteOrigin = true,
} : {
  uploadUrl: string
  shouldStripGpsData?: boolean
  shouldDeleteOrigin?: boolean
}) => {
  const fileNameBase = generateRandomFileNameForPhoto();
  const { fileExtension } = getFileNamePartsFromStorageUrl(uploadUrl);
  const fileName = `${fileNameBase}.${fileExtension}`;
  let promise: Promise<string>;
  if (shouldStripGpsData) {
    const fileWithoutGps = await removeGpsData(await fetchUrlStream(uploadUrl));
    promise = putFile(fileWithoutGps, fileName)
      .then(async url => {
        if (url && shouldDeleteOrigin) { await deleteFile(uploadUrl); }
        return url;
      });
  } else {
    promise = shouldDeleteOrigin
      ? moveFile(uploadUrl, fileName)
      : copyFile(uploadUrl, fileName);
  }
  // Store optimized photos after original photo is copied/moved
  const updatedUrl = await promise
    .then(url => storeOptimizedPhotosForUrl(url));

  return updatedUrl;
};
