import { getExtensionFromBlobUrl, getIdFromBlobUrl } from '@/services/blob';
import { convertExifToFormData } from '@/photo/form';
import {
  FujifilmSimulation,
  getFujifilmSimulationFromMakerNote,
  isExifForFujifilm,
} from '@/vendors/fujifilm';
import { ExifData, ExifParserFactory } from 'ts-exif-parser';
import { PhotoFormData } from './form';

export const extractFormDataFromUploadPath = async (
  uploadPath: string
): Promise<{
  blobId?: string
  photoForm?: Partial<PhotoFormData>
}> => {
  const url = decodeURIComponent(uploadPath);

  const blobId = getIdFromBlobUrl(url);

  const extension = getExtensionFromBlobUrl(url);

  const fileBytes = uploadPath
    ? await fetch(url)
      .then(res => res.arrayBuffer())
    : undefined;

  let exifDataForm: ExifData | undefined;
  let filmSimulation: FujifilmSimulation | undefined;

  if (fileBytes) {
    const parser = ExifParserFactory.create(Buffer.from(fileBytes));

    // Data for form
    parser.enableBinaryFields(false);
    exifDataForm = parser.parse();

    // Capture film simulation for Fujifilm cameras
    if (isExifForFujifilm(exifDataForm)) {
      // Parse exif data again with binary fields
      // in order to access MakerNote tag
      parser.enableBinaryFields(true);
      const exifDataBinary = parser.parse();
      const makerNote = exifDataBinary.tags?.MakerNote;
      if (Buffer.isBuffer(makerNote)) {
        filmSimulation = getFujifilmSimulationFromMakerNote(makerNote);
      }
    }
  }

  return {
    blobId,
    ...exifDataForm && {
      photoForm: {
        ...convertExifToFormData(exifDataForm, filmSimulation),
        extension,
        url: decodeURIComponent(uploadPath),
      },
    },
  };
};
