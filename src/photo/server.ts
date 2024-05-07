import {
  getExtensionFromStorageUrl,
  getIdFromStorageUrl,
} from '@/services/storage';
import { convertExifToFormData } from '@/photo/form';
import {
  getFujifilmSimulationFromMakerNote,
  isExifForFujifilm,
} from '@/vendors/fujifilm';
import { ExifData, ExifParserFactory } from 'ts-exif-parser';
import { PhotoFormData } from './form';
import { FilmSimulation } from '@/simulation';
import sharp, { Sharp } from 'sharp';

const IMAGE_WIDTH_RESIZE = 200;
const IMAGE_WIDTH_BLUR = 200;

export const extractImageDataFromBlobPath = async (
  blobPath: string,
  options?: {
    includeInitialPhotoFields?: boolean
    generateBlurData?: boolean
    generateResizedImage?: boolean
  },
): Promise<{
  blobId?: string
  photoFormExif?: Partial<PhotoFormData>
  imageResizedBase64?: string
}> => {
  const {
    includeInitialPhotoFields,
    generateBlurData,
    generateResizedImage,
  } = options ?? {};

  const url = decodeURIComponent(blobPath);

  const blobId = getIdFromStorageUrl(url);

  const extension = getExtensionFromStorageUrl(url);

  const fileBytes = blobPath
    ? await fetch(url).then(res => res.arrayBuffer())
    : undefined;

  let exifData: ExifData | undefined;
  let filmSimulation: FilmSimulation | undefined;
  let blurData: string | undefined;
  let imageResizedBase64: string | undefined;

  if (fileBytes) {
    const parser = ExifParserFactory.create(Buffer.from(fileBytes));

    // Data for form
    parser.enableBinaryFields(false);
    exifData = parser.parse();

    // Capture film simulation for Fujifilm cameras
    if (isExifForFujifilm(exifData)) {
      // Parse exif data again with binary fields
      // in order to access MakerNote tag
      parser.enableBinaryFields(true);
      const exifDataBinary = parser.parse();
      const makerNote = exifDataBinary.tags?.MakerNote;
      if (Buffer.isBuffer(makerNote)) {
        filmSimulation = getFujifilmSimulationFromMakerNote(makerNote);
      }
    }

    if (generateBlurData) {
      blurData = await blurImage(fileBytes);
    }

    if (generateResizedImage) {
      imageResizedBase64 = await resizeImage(fileBytes);
    }
  }

  return {
    blobId,
    ...exifData && {
      photoFormExif: {
        ...includeInitialPhotoFields && {
          hidden: 'false',
          favorite: 'false',
          extension,
          url,
        },
        ...generateBlurData && { blurData },
        ...convertExifToFormData(exifData, filmSimulation),
      },
    },
    imageResizedBase64,
  };
};

const generateBase64 = async (
  image: ArrayBuffer,
  middleware: (sharp: Sharp) => Sharp,
) => 
  middleware(sharp(image))
    .toFormat('jpeg', { quality: 90 })
    .toBuffer()
    .then(data => `data:image/jpeg;base64,${data.toString('base64')}`);

const resizeImage = async (image: ArrayBuffer) => 
  generateBase64(image, sharp =>  sharp
    .resize(IMAGE_WIDTH_RESIZE)
  );

const blurImage = async (image: ArrayBuffer) => 
  generateBase64(image, sharp =>  sharp
    .resize(IMAGE_WIDTH_BLUR)
    .modulate({ saturation: 1.15 })
    .blur(4)
  );

export const resizeImageFromUrl = async (url: string) => 
  fetch(decodeURIComponent(url))
    .then(res => res.arrayBuffer())
    .then(buffer => resizeImage(buffer));

export const blurImageFromUrl = async (url: string) => 
  fetch(decodeURIComponent(url))
    .then(res => res.arrayBuffer())
    .then(buffer => blurImage(buffer));
