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
  const fileNameBase = generateRandomFileNameForPhoto();
  const { fileExtension } = getFileNamePartsFromStorageUrl(urlOrigin);
  const fileName = `${fileNameBase}.${fileExtension}`;
  const fileBytes = _fileBytes
    ? _fileBytes
    : await fetch(urlOrigin, { cache: 'no-store' })
      .then(res => res.arrayBuffer());
  let promise: Promise<string>;
  if (shouldStripGpsData) {
    const fileWithoutGps = await removeGpsData(fileBytes);
    promise = putFile(fileWithoutGps, fileName).then(async url => {
      if (url && shouldDeleteOrigin) { await deleteFile(urlOrigin); }
      return url;
    });
  } else {
    promise = shouldDeleteOrigin
      ? moveFile(urlOrigin, fileName)
      : copyFile(urlOrigin, fileName);
  }
  return promise.then(async url => {
    // Store optimized photos once original photo is copied/moved
    const optimizedPhotoFileMeta = getOptimizedPhotoFileMeta(fileNameBase);
    for (const { size, fileName } of optimizedPhotoFileMeta) {
      console.log('Storing optimized photo', fileName);
      await putFile(
        await resizeImageToBytes(fileBytes, size),
        fileName,
      );
    }
    return url;
  });
};
