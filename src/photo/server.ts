import {
  deleteFilesWithPrefix,
  getFileNamePartsFromStorageUrl,
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
  AUTO_GENERATE_LOCATIONS,
  GEO_PRIVACY_ENABLED,
  HAS_LOCATION_SERVICES,
  PRESERVE_ORIGINAL_UPLOADS,
} from '@/app/config';
import { isExifForFujifilm } from '@/platforms/fujifilm/server';
import {
  FujifilmRecipe,
  getFujifilmRecipeFromMakerNote,
} from '@/platforms/fujifilm/recipe';
import {
  getNikonPictureControlFromMakerNote,
  NikonPictureControl,
} from '@/platforms/nikon/simulation';
import { isExifForNikon } from '@/platforms/nikon/server';
import {
  deletePhoto,
  getCustomRecipeTitleForData,
  renameRecipeForMatchingPhotos,
} from '@/photo/query';
import { PhotoDbInsert } from '.';
import { convertExifToFormData } from './form/server';
import { getColorFieldsForPhotoForm } from './color/server';
import exifr from 'exifr';
import { getCompatibleExifValue } from '@/utility/exif';
import { fetchUrlHeader, fetchUrlStream } from '@/utility/fetch';
import { getPlaceFromCoordinates } from '@/platforms/google-places';
import {
  isOmSystemCamera,
  OmRecipe,
} from '@/platforms/om-system/recipe';
import {
  getOmFocalLengthIn35MmFormat,
  getOmRecipeFromMakerNote,
} from '@/platforms/om-system/server';

import { createOmRecipeData, getOmRecipe, isOmRecipeData, parseRecipeData }
  from '@/recipe/serialization';
import { isRecipeHashKey } from '@/recipe/key';
import {
  createRecipeHashKey,
  createRecipeIdentityKey,
} from '@/recipe/server';

const IMAGE_WIDTH_BLUR = 200;
const IMAGE_WIDTH_DEFAULT = 200;
const IMAGE_QUALITY_DEFAULT = 80;

// EXIF, XMP, and MakerNote data live in the leading bytes of an image, so
// parsing only needs a bounded header fetch rather than the full file.
// Kept generous to cover large embedded thumbnails and XMP packets.
const MAX_EXIF_HEADER_BYTES = 4 * 1024 * 1024;

export const extractImageDataFromBlobPath = async (
  blobPath: string, {
    includeInitialPhotoFields,
    generateBlurData,
    generateResizedImage,
    updateColorFields = true,
    lookupLocation,
    refreshOmRecipe = false,
  }: {
    includeInitialPhotoFields?: boolean
    generateBlurData?: boolean
    generateResizedImage?: boolean
    updateColorFields?: boolean
    lookupLocation?: boolean
    // Refresh known OM photos even if the source lost its camera tags.
    refreshOmRecipe?: boolean
  } = {},
): Promise<{
  blobId?: string
  formDataFromExif?: Partial<PhotoFormData>
  imageResizedBase64?: string
  shouldStripGpsData?: boolean
  error?: string
}> => {
  const url = decodeURIComponent(blobPath);

  const {
    fileExtension: extension,
    fileId: blobId,
  } = getFileNamePartsFromStorageUrl(url);

  let dataExif: ExifData | undefined;
  let dataExifr: any | undefined;
  let film: FujifilmSimulation | NikonPictureControl | undefined;
  let recipe: FujifilmRecipe | undefined;
  let omRecipe: OmRecipe | undefined;
  let didCheckOmRecipe = false;
  let blurData: string | undefined;
  let imageResizedBase64: string | undefined;
  let shouldStripGpsData = false;
  let error: string | undefined;

  const headerBytes = blobPath
    ? await fetchUrlHeader(url, MAX_EXIF_HEADER_BYTES)
      .catch(e => {
        error = `Error fetching image from ${url}: "${e.message}"`;
        return undefined;
      })
    : undefined;

  try {
    if (headerBytes) {
      const parser = ExifParserFactory.create(Buffer.from(headerBytes));

      // Data for form
      parser.enableBinaryFields(false);
      dataExif = parser.parse();
      dataExifr = await exifr.parse(headerBytes, { xmp: true });

      // Capture film simulation for Fujifilm or Picture Control for Nikon
      const isOmCamera = isOmSystemCamera(dataExif.tags?.Make);
      if (isExifForFujifilm(dataExif) || isExifForNikon(dataExif) ||
        isOmCamera) {
        // Parse exif data again with binary fields
        // in order to access MakerNote tag
        parser.enableBinaryFields(true);
        const exifDataBinary = parser.parse();
        const makerNote = exifDataBinary.tags?.MakerNote;
        if (Buffer.isBuffer(makerNote)) {
          if (isExifForFujifilm(dataExif)) {
            film = getFujifilmSimulationFromMakerNote(makerNote);
            recipe = getFujifilmRecipeFromMakerNote(makerNote);
          } else if (isExifForNikon(dataExif)) {
            film = getNikonPictureControlFromMakerNote(makerNote);
          } else if (isOmCamera) {
            omRecipe = getOmRecipeFromMakerNote(makerNote);
            const equivalent = Number(getCompatibleExifValue(
              'FocalLengthIn35mmFormat', dataExif, dataExifr,
            ));
            if ((!Number.isFinite(equivalent) || equivalent <= 0) &&
              dataExif.tags) {
              const focalLength = Number(
                getCompatibleExifValue('FocalLength', dataExif, dataExifr),
              );
              const digitalZoomRatio = Number(getCompatibleExifValue(
                'DigitalZoomRatio', dataExif, dataExifr,
              ));
              dataExif.tags.FocalLengthIn35mmFormat =
                getOmFocalLengthIn35MmFormat(
                  makerNote, focalLength, digitalZoomRatio,
                )?.toString();
            }
          }
        }
      }
      didCheckOmRecipe = isOmCamera || (refreshOmRecipe && !recipe);

      if (generateBlurData) {
        blurData = await blurImage(await fetchUrlStream(url));
      }

      if (generateResizedImage) {
        imageResizedBase64 = await resizeImage(await fetchUrlStream(url));
      }

      shouldStripGpsData = GEO_PRIVACY_ENABLED && (
        Boolean(getCompatibleExifValue('GPSLatitude', dataExif, dataExifr)) ||
        Boolean(getCompatibleExifValue('GPSLongitude', dataExif, dataExifr))
      );
    }
  } catch (e) {
    error = `Error extracting image data from ${url}: "${e}"`;
  }

  if (error) { console.log(error); }

  const colorFields = updateColorFields
    ? await getColorFieldsForPhotoForm(url)
    : undefined;

  const formDataFromExif: Partial<PhotoFormData> | undefined = dataExif
    ? {
      ...includeInitialPhotoFields && {
        hidden: 'false',
        favorite: 'false',
        extension,
        url,
      },
      ...generateBlurData && { blurData },
      ...convertExifToFormData(dataExif, dataExifr, film, recipe),
      ...didCheckOmRecipe && {
        recipeData: JSON.stringify(createOmRecipeData(omRecipe)),
      },
      ...colorFields,
    }
    : undefined;

  if (formDataFromExif && (recipe || didCheckOmRecipe)) {
    const recipeTitle = await getAutoRecipeTitle(
      formDataFromExif.recipeData,
      formDataFromExif.film,
    );
    // OM titles always reflect the source, Fujifilm titles only matches
    if (recipeTitle || didCheckOmRecipe) {
      formDataFromExif.recipeTitle = recipeTitle ?? '';
    }
  }

  return {
    blobId,
    ...formDataFromExif && {
      formDataFromExif: {
        ...formDataFromExif,
        ...await getLocationFormFieldsFromExif(
          formDataFromExif,
          lookupLocation,
        ),
      },
    },
    imageResizedBase64,
    shouldStripGpsData,
    error,
  };
};

const getLocationFormFieldsFromExif = async (
  formData: Partial<PhotoFormData>,
  lookupLocation?: boolean,
): Promise<Partial<PhotoFormData> | undefined> => {
  if (
    !lookupLocation ||
    !AUTO_GENERATE_LOCATIONS ||
    GEO_PRIVACY_ENABLED ||
    !HAS_LOCATION_SERVICES ||
    !formData.latitude ||
    !formData.longitude
  ) {
    return;
  }

  const latitude = parseFloat(formData.latitude);
  const longitude = parseFloat(formData.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return;
  }

  try {
    const place = await getPlaceFromCoordinates(latitude, longitude);
    if (!place) { return; }
    return {
      location: JSON.stringify(place),
      locationDisplayName: place.nameFormatted ?? place.name,
    };
  } catch (e) {
    console.log('Error looking up place from coordinates', e);
  }
};

type ImageInput = ArrayBuffer | NodeJS.ReadableStream;

// sharp consumes Readable stream input via `pipe` rather than as a direct
// argument, and its published types only list Buffer/ArrayBuffer/TypedArray/
// string inputs, hence the split handling.
const sharpFrom = (image: ImageInput): Sharp => {
  if (image instanceof ArrayBuffer) {
    return sharp(image);
  }
  const instance = sharp();
  const stream = image as NodeJS.ReadableStream;
  // If the download fails mid-stream, end the input so sharp rejects on the
  // truncated data instead of hanging or emitting an unhandled stream error.
  stream.on('error', err => {
    console.log('Error streaming image input', err);
    instance.end();
  });
  stream.pipe(instance);
  return instance;
};

const generateBase64 = async (
  image: ImageInput,
  middleware?: (sharp: Sharp) => Sharp,
) => 
  (middleware ? middleware(sharpFrom(image)) : sharpFrom(image))
    .withMetadata()
    .toFormat('jpeg', { quality: IMAGE_QUALITY_DEFAULT })
    .toBuffer()
    .then(data => `data:image/jpeg;base64,${data.toString('base64')}`);

const resizeImage = async (
  image: ImageInput,
  width = IMAGE_WIDTH_DEFAULT,
) => 
  generateBase64(image, sharp => sharp
    .resize(width),
  );

const blurImage = async (image: ImageInput) => 
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
  fetchUrlStream(decodeURIComponent(url))
    .then(stream => resizeImage(stream, width))
    .catch(e => {
      console.log(`Error resizing image from URL (${url})`, e);
      return '';
    });

export const blurImageFromUrl = async (url: string) => 
  fetchUrlStream(decodeURIComponent(url))
    .then(stream => blurImage(stream))
    .catch(e => {
      console.log(`Error blurring image from URL (${url})`, e);
      return '';
    });

export const resizeImageToBytes = async (
  image: ImageInput,
  width: number,
  quality = IMAGE_QUALITY_DEFAULT,
) => 
  sharpFrom(image)
    .rotate()
    .keepIccProfile()
    .resize(width)
    .toFormat('jpeg', { quality })
    .toBuffer();

const GPS_NULL_STRING = '-';

export const removeGpsData = async (image: ImageInput) =>
  sharpFrom(image)
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

// Prefer a custom title already given to matching recipe data
export const getAutoRecipeTitle = async (
  recipeData?: string,
  film?: string,
) =>
  recipeData
    ? await getCustomRecipeTitleForData(recipeData, film) ??
      createRecipeHashKey(recipeData)
    : undefined;

type RecipeFields = { recipeData?: string | object, film?: string };

// Custom titles survive re-extraction while their recipe is unchanged
export const shouldPreserveRecipeTitle = (
  title: string | undefined,
  previous: RecipeFields,
  next: RecipeFields,
) => {
  if (!title || isRecipeHashKey(title)) { return false; }
  const previousKey =
    createRecipeIdentityKey(previous.recipeData, previous.film);
  return previousKey !== undefined &&
    previousKey === createRecipeIdentityKey(next.recipeData, next.film);
};

export const convertFormDataToPhotoDbInsertAndLookupRecipeTitle =
  async (...args: Parameters<typeof convertFormDataToPhotoDbInsert>):
    Promise<ReturnType<typeof convertFormDataToPhotoDbInsert>> => {
    const photo = convertFormDataToPhotoDbInsert(...args);

    const data = parseRecipeData(photo.recipeData);
    if (isOmRecipeData(data)) {
      const recipe = isOmSystemCamera(photo.make)
        ? getOmRecipe(data) : undefined;
      photo.recipeData = JSON.stringify(createOmRecipeData(recipe));
    }

    if (!photo.recipeTitle) {
      photo.recipeTitle =
        await getAutoRecipeTitle(photo.recipeData, photo.film);
    } else if (isRecipeHashKey(photo.recipeTitle)) {
      // Derive hash titles from data rather than trusting a submitted title
      photo.recipeTitle = createRecipeHashKey(photo.recipeData);
    }

    return photo;
  };

export const propagateRecipeTitleIfNecessary = async (
  formData: FormData,
  photo: PhotoDbInsert,
  previousTitle?: string,
) => {
  if (
    // Only propagate recipe title if set by user before lookup
    formData.get('recipeTitle') &&
    photo.recipeTitle &&
    photo.recipeTitle !== previousTitle
  ) {
    await renameRecipeForMatchingPhotos({
      photoId: photo.id,
      previousTitle,
      title: photo.recipeTitle,
      recipeData: photo.recipeData,
      film: photo.film,
    });
  }
};

export const deletePhotoAndFiles = async (
  photoId: string,
  photoUrl: string,
) =>
  deletePhoto(photoId)
    .then(() => {
      const { fileNameBase } = getFileNamePartsFromStorageUrl(photoUrl);
      return deleteFilesWithPrefix(fileNameBase);
    });
