import {
  getExtensionFromStorageUrl,
  getIdFromStorageUrl,
} from '@/platforms/storage';
import { convertFormDataToPhotoDbInsert } from '@/photo/form';
import {
  FujifilmSimulation,
  getFujifilmSimulationFromMakerNote,
} from '@/platforms/fujifilm/simulation';
import { ExifData, ExifParserFactory } from 'ts-exif-parser';
import { PhotoFormData } from './form';
import sharp, { Sharp } from 'sharp';
import {
  GEO_PRIVACY_ENABLED,
  PRESERVE_ORIGINAL_UPLOADS,
} from '@/app/config';
import { isExifForFujifilm } from '@/platforms/fujifilm/server';
import {
  FujifilmRecipe,
  getFujifilmRecipeFromMakerNote,
} from '@/platforms/fujifilm/recipe';
import {
  getRecipeTitleForData,
  updateAllMatchingRecipeTitles,
} from './db/query';
import { PhotoDbInsert } from '.';
import { convertExifToFormData } from './form/server';
import { getColorFieldsForPhotoForm } from './color/server';

const IMAGE_WIDTH_RESIZE = 200;
const IMAGE_WIDTH_BLUR = 200;

export const extractImageDataFromBlobPath = async (
  blobPath: string,
  options: {
    includeInitialPhotoFields?: boolean
    generateBlurData?: boolean
    generateResizedImage?: boolean
  } = {},
): Promise<{
  blobId?: string
  formDataFromExif?: Partial<PhotoFormData>
  imageResizedBase64?: string
  shouldStripGpsData?: boolean
  fileBytes?: ArrayBuffer
  error?: string
}> => {
  const {
    includeInitialPhotoFields,
    generateBlurData,
    generateResizedImage,
  } = options;

  const url = decodeURIComponent(blobPath);

  const blobId = getIdFromStorageUrl(url);

  const extension = getExtensionFromStorageUrl(url);

  let exifData: ExifData | undefined;
  let film: FujifilmSimulation | undefined;
  let recipe: FujifilmRecipe | undefined;
  let blurData: string | undefined;
  let imageResizedBase64: string | undefined;
  let shouldStripGpsData = false;
  let error: string | undefined;

  const fileBytes = blobPath
    ? await fetch(url, { cache: 'no-store' }).then(res => res.arrayBuffer())
      .catch(e => {
        error = `Error fetching image from ${url}: "${e.message}"`;
        return undefined;
      })
    : undefined;

  try {
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
          film = getFujifilmSimulationFromMakerNote(makerNote);
          recipe = getFujifilmRecipeFromMakerNote(makerNote);
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
  } catch (e) {
    error = `Error extracting image data from ${url}: "${e}"`;
  }

  if (error) { console.log(error); }

  const colorFields = await getColorFieldsForPhotoForm(url);

  return {
    blobId,
    ...exifData && {
      formDataFromExif: {
        ...includeInitialPhotoFields && {
          hidden: 'false',
          favorite: 'false',
          extension,
          url,
        },
        ...generateBlurData && { blurData },
        ...convertExifToFormData(exifData, film, recipe),
        ...colorFields,
      },
    },
    imageResizedBase64,
    shouldStripGpsData,
    fileBytes,
    error,
  };
};

const generateBase64 = async (
  image: ArrayBuffer,
  middleware?: (sharp: Sharp) => Sharp,
) => 
  (middleware ? middleware(sharp(image)) : sharp(image))
    .withMetadata()
    .toFormat('jpeg', { quality: 90 })
    .toBuffer()
    .then(data => `data:image/jpeg;base64,${data.toString('base64')}`);

const resizeImage = async (
  image: ArrayBuffer,
  width = IMAGE_WIDTH_RESIZE,
) => 
  generateBase64(image, sharp => sharp
    .resize(width),
  );

const blurImage = async (image: ArrayBuffer) => 
  generateBase64(image, sharp => sharp
    .resize(IMAGE_WIDTH_BLUR)
    .modulate({ saturation: 1.15 })
    .blur(4),
  );

export const getImageBase64FromUrl = async (url: string) => 
  fetch(decodeURIComponent(url))
    .then(res => res.arrayBuffer())
    .then(buffer => generateBase64(buffer))
    .catch(e => {
      console.log(`Error getting image base64 from URL (${url})`, e);
      return '';
    });

export const resizeImageFromUrl = async (
  url: string,
  width?: number,
) => 
  fetch(decodeURIComponent(url))
    .then(res => res.arrayBuffer())
    .then(buffer => resizeImage(buffer, width))
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
    .toFormat('jpeg', { quality: PRESERVE_ORIGINAL_UPLOADS ? 95 : 80 })
    .toBuffer();

export const convertFormDataToPhotoDbInsertAndLookupRecipeTitle =
  async (...args: Parameters<typeof convertFormDataToPhotoDbInsert>):
  Promise<ReturnType<typeof convertFormDataToPhotoDbInsert>> => {
    const photo = convertFormDataToPhotoDbInsert(...args);

    if (photo.recipeData && !photo.recipeTitle && photo.film) {
      const recipeTitle = await getRecipeTitleForData(
        photo.recipeData,
        photo.film,
      );
      // Only replace recipe title when a new one is found
      if (recipeTitle) {
        photo.recipeTitle = recipeTitle;
      }
    }

    return photo;
  };

export const propagateRecipeTitleIfNecessary = async (
  formData: FormData,
  photo: PhotoDbInsert,
) => {
  if (
    formData.get('applyRecipeTitleGlobally') === 'true' &&
    // Only propagate recipe title if set by user before lookup
    formData.get('recipeTitle') &&
    photo.recipeTitle &&
    photo.recipeData &&
    photo.film
  ) {
    await updateAllMatchingRecipeTitles(
      photo.recipeTitle,
      photo.recipeData,
      photo.film,
    );
  }
};
