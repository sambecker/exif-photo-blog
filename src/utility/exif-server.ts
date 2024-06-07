// import * as PiExif from 'piexifjs';
import { b64toBlob } from './data';
import { removeGpsData } from '@/photo/server';

export const stripGpsFromFile = async (
  fileBytes: ArrayBuffer
): Promise<Blob> => {
  // const base64 = Buffer.from(fileBytes).toString('base64');
  // const base64Url = `data:image/jpeg;base64,${base64}`;

  // console.log('Stripping GPS from file');
  // const exifObject = PiExif.load(base64Url);
  // delete exifObject.GPS;
  // const exifDataWithoutGps = PiExif.dump(exifObject);

  // console.log('Updating EXIF');
  // const data = PiExif.insert(
  //   exifDataWithoutGps,
  //   base64Url,
  // );

  // console.log('EXIF updated');

  // Removing EXIF data with Sharp
  return b64toBlob(await removeGpsData(fileBytes));
};
