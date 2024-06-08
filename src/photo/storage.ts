import {
  deleteFile,
  generateRandomFileNameForPhoto,
  getExtensionFromStorageUrl,
  moveFile,
  putFile,
} from '@/services/storage';
import { removeGpsData } from './server';

export const convertUploadToPhoto = async (
  urlOrigin: string,
  stripGps?: boolean,
  fileBytes?: ArrayBuffer,
) => {
  const fileName = generateRandomFileNameForPhoto();
  const fileExtension = getExtensionFromStorageUrl(urlOrigin);
  const photoPath = `${fileName}.${fileExtension || 'jpg'}`;
  if (stripGps) {
    const fileWithoutGps = await removeGpsData(
      fileBytes ?? await fetch(urlOrigin, { cache: 'no-store' })
        .then(res => res.arrayBuffer())
    );
    return putFile(fileWithoutGps, photoPath).then(async url => {
      if (url) { await deleteFile(urlOrigin); }
      return url;
    });
  } else {
    return moveFile(urlOrigin, photoPath);
  }
};
