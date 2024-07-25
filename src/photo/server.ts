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
import { GEO_PRIVACY_ENABLED, PRO_MODE_ENABLED } from '@/site/config';

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
  shouldStripGpsData?: boolean
  fileBytes?: ArrayBuffer
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
    ? await fetch(url, { cache: 'no-store' }).then(res => res.arrayBuffer())
    : undefined;

  let exifData: ExifData | undefined;
  let filmSimulation: FilmSimulation | undefined;
  let blurData: string | undefined;
  let imageResizedBase64: string | undefined;
  let shouldStripGpsData = false;

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

    shouldStripGpsData = GEO_PRIVACY_ENABLED && (
      Boolean(exifData.tags?.GPSLatitude) ||
      Boolean(exifData.tags?.GPSLongitude)
    );
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
    shouldStripGpsData,
    fileBytes,
  };
};

const generateBase64 = async (
  image: ArrayBuffer,
  middleware: (sharp: Sharp) => Sharp,
) => 
  middleware(sharp(image))
    .withMetadata()
    .toFormat('jpeg', { quality: 90 })
    .toBuffer()
    .then(data => `data:image/jpeg;base64,${data.toString('base64')}`);

const resizeImage = async (image: ArrayBuffer) => 
  generateBase64(image, sharp => sharp
    .resize(IMAGE_WIDTH_RESIZE)
  );

const blurImage = async (image: ArrayBuffer) => 
  generateBase64(image, sharp => sharp
    .resize(IMAGE_WIDTH_BLUR)
    .modulate({ saturation: 1.15 })
    .blur(4)
  );

export const resizeImageFromUrl = async (url: string) => 
  fetch(decodeURIComponent(url))
    .then(res => res.arrayBuffer())
    .then(buffer => resizeImage(buffer))
    .catch(e => {
      console.log(`Error resizing image from URL (${url})`, e);
      return '';
    });

export const blurImageFromUrl = async (url: string) => 
  fetch(decodeURIComponent(url))
    .then(res => res.arrayBuffer())
    .then(buffer => blurImage(buffer))
    .catch(e => {
      console.log(`Error blurring image from URL (${url})`, e);
      return '';
    });

const GPS_NULL_STRING = '-';

export const removeGpsData = async (image: ArrayBuffer) =>
  sharp(image)
    .withExifMerge({
      IFD3: {
        GPSMapDatum: GPS_NULL_STRING,
        GPSLatitude: GPS_NULL_STRING,
        GPSLongitude: GPS_NULL_STRING,
        GPSDateStamp: GPS_NULL_STRING,
        GPSDateTime: GPS_NULL_STRING,
        GPSTimeStamp: GPS_NULL_STRING,
        GPSAltitude: GPS_NULL_STRING,
        GPSSatellites: GPS_NULL_STRING,
        GPSAreaInformation: GPS_NULL_STRING,
        GPSSpeed: GPS_NULL_STRING,
        GPSImgDirection: GPS_NULL_STRING,
        GPSDestLatitude: GPS_NULL_STRING,
        GPSDestLongitude: GPS_NULL_STRING,
        GPSDestBearing: GPS_NULL_STRING,
        GPSDestDistance: GPS_NULL_STRING,
        GPSHPositioningError: GPS_NULL_STRING,
      },
    })
    .toFormat('jpeg', { quality: PRO_MODE_ENABLED ? 95 : 80 })
    .toBuffer();
