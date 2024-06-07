import {
  deleteFile,
  generateRandomFileNameForPhoto,
  getExtensionFromStorageUrl,
  moveFile,
  putFile,
} from '@/services/storage';
import { stripGpsFromFile } from '@/utility/exif-server';

export const convertUploadToPhoto = async (
  urlOrigin: string,
  stripGps?: boolean,
) => {
  const fileName = generateRandomFileNameForPhoto();
  const fileExtension = getExtensionFromStorageUrl(urlOrigin);
  const photoPath = `${fileName}.${fileExtension || 'jpg'}`;
  if (stripGps) {
    console.log('Fetching original file');
    const fileBytes = await fetch(urlOrigin, { cache: 'no-store' })
      .then(res => res.arrayBuffer());
    const fileWithoutGps = await stripGpsFromFile(fileBytes);
    console.log('Uploading file without GPS');
    return putFile(fileWithoutGps, photoPath).then(async url => {
      if (url) {
        console.log('Deleting original file');
        await deleteFile(urlOrigin);
      } else {
        console.log('No url found');
      }
      return url;
    });
  } else {
    return moveFile(urlOrigin, photoPath);
  }
};
