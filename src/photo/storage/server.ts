import {
  copyFile,
  deleteFile,
  getFileNamePartsFromStorageUrl,
  moveFile,
  putFile,
} from '@/platforms/storage';
import { removeGpsData, resizeImageToBytes } from '../server';
import {
  generateRandomFileNameForPhoto,
  getOptimizedPhotoFileMeta,
} from '.';

export const convertUploadToPhoto = async ({
  uploadUrl,
  fileBytes: _fileBytes,
  shouldStripGpsData,
  shouldDeleteOrigin = true,
} : {
  uploadUrl: string
  fileBytes?: ArrayBuffer
  shouldStripGpsData?: boolean
  shouldDeleteOrigin?: boolean
}) => {
  const fileNameBase = generateRandomFileNameForPhoto();
  const { fileExtension } = getFileNamePartsFromStorageUrl(uploadUrl);
  const fileName = `${fileNameBase}.${fileExtension}`;
  const fileBytes = _fileBytes
    ? _fileBytes
    : await fetch(uploadUrl).then(res => res.arrayBuffer());
  let promise: Promise<string>;
  if (shouldStripGpsData) {
    const fileWithoutGps = await removeGpsData(fileBytes);
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
  return promise.then(async url => {
    // Store optimized photos once original photo is copied/moved
    const optimizedPhotoFileMeta = getOptimizedPhotoFileMeta(fileNameBase);
    for (const { size, fileName } of optimizedPhotoFileMeta) {
      await putFile(
        await resizeImageToBytes(fileBytes, size),
        fileName,
      );
    }
    return url;
  });
};
