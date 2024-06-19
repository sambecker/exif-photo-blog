import {
  copyFile,
  deleteFile,
  generateRandomFileNameForPhoto,
  getExtensionFromStorageUrl,
  moveFile,
  putFile,
} from '@/services/storage';
import { removeGpsData } from './server';

export const convertUploadToPhoto = async ({
  urlOrigin,
  fileBytes,
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
  const photoPath = `${fileName}.${fileExtension || 'jpg'}`;
  if (shouldStripGpsData) {
    const fileWithoutGps = await removeGpsData(
      fileBytes ?? await fetch(urlOrigin, { cache: 'no-store' })
        .then(res => res.arrayBuffer())
    );
    return putFile(fileWithoutGps, photoPath).then(async url => {
      if (url && shouldDeleteOrigin) { await deleteFile(urlOrigin); }
      return url;
    });
  } else {
    return shouldDeleteOrigin
      ? moveFile(urlOrigin, photoPath)
      : copyFile(urlOrigin, photoPath);
  }
};
