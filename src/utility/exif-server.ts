import * as PiExif from 'piexifjs';

export const removeGpsFromFile = async (
  fileBytes: ArrayBuffer
): Promise<Blob> => {
  const base64 = Buffer.from(fileBytes).toString('base64');
  const base64Url = `data:image/jpeg;base64,${base64}`;

  const exifObject = PiExif.load(base64Url) as Record<string, any>;
  delete exifObject.GPS;
  const exifDataWithoutGps = PiExif.dump(exifObject);

  const data = PiExif.insert(
    exifDataWithoutGps,
    base64Url,
  );

  return fetch(data, { cache: 'no-store' }).then(res => res.blob());
};
