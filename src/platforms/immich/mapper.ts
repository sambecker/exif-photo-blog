import { Photo } from '@/photo';
import { ImmichAsset } from './client';
import { formatFocalLength } from '@/focal';
import {
  formatAperture,
  formatExposureCompensation,
  formatExposureTime,
  formatIso,
} from '@/utility/exif-format';
import { formatDateFromPostgresString } from '@/utility/date';
import { generatePhotoSyncStatus } from '@/photo/sync';
import { getBaseUrl, GRID_ASPECT_RATIO } from '@/app/config';

const BLUR_DATA_URL =
  'data:image/gif;base64,' +
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const convertImmichAssetToPhoto = (
  asset: ImmichAsset, size: string = 'thumbnail'): Photo => {
  const exif = asset.exifInfo;
  const baseUrl = getBaseUrl();
  return {
    // export interface Photo extends Omit<PhotoDb, 'recipeData'> 
    focalLengthFormatted: formatFocalLength(exif?.focalLength),
    focalLengthIn35MmFormatFormatted: undefined,
    fNumberFormatted: formatAperture(exif?.fNumber),
    isoFormatted: formatIso(exif?.iso),
    exposureTimeFormatted: formatExposureTime(
      exif?.exposureTime ? parseFloat(exif.exposureTime) : undefined,
    ),
    exposureCompensationFormatted: formatExposureCompensation(
      exif?.exposureCompensation ?
        parseFloat(exif.exposureCompensation) : undefined,
    ),
    takenAtNaiveFormatted: formatDateFromPostgresString(
      exif?.dateTimeOriginal || asset.localDateTime || asset.fileCreatedAt,
      'short',
    ),
    tags: asset?.tags || [],
    recipeData: undefined,
    syncStatus: generatePhotoSyncStatus(dummyPhotoDb),
    // export interface PhotoDb extends Omit<PhotoDbInsert, 'takenAt' | 'tags'> 
    updatedAt: new Date(asset.updatedAt),
    createdAt: new Date(asset.fileCreatedAt),
    takenAt: new Date(exif?.dateTimeOriginal || asset.fileCreatedAt),
    // export interface PhotoDbInsert extends PhotoExif
    id: asset.id,
    url: `${baseUrl}/api/immich/assets/${asset.id}/thumbnail?size=${size}`,
    extension: asset.originalPath.split('.').pop()?.toLowerCase() || 'jpg',
    //blurData: `/api/immich/assets/${asset.id}/blur`,
    blurData: BLUR_DATA_URL,
    title: asset.originalFileName?.replace(/\.[^/.]+$/, '') || '',
    caption: exif?.description || '',
    semanticDescription: exif?.description || '',
    recipeTitle: 'Not available',
    locationName: [exif?.city, exif?.state, exif?.country].
      filter(Boolean).join(', '),
    priorityOrder: undefined,
    hidden: asset.isArchived,
    takenAtNaive: formatDateFromPostgresString(
      exif?.dateTimeOriginal ||
      asset.localDateTime ||
      asset.fileCreatedAt),
    // PhotoExif
    aspectRatio: exif?.exifImageWidth && exif?.exifImageHeight
      ? exif.exifImageWidth / exif.exifImageHeight
      : GRID_ASPECT_RATIO,
    make: exif?.make || '',
    model: exif?.model || '',
    focalLength: exif?.focalLength ? Math.round(exif.focalLength) : undefined,
    focalLengthIn35MmFormat: undefined,
    lensMake: exif?.lensMake || '',
    lensModel: exif?.lensModel || '',
    fNumber: exif?.fNumber,
    iso: exif?.iso,
    exposureTime: exif?.exposureTime
      ? (exif.exposureTime.includes('/')
        ? (() => {
          const [numerator, denominator] = exif.exposureTime.
            split('/').map(Number);
          return denominator ? numerator / denominator : undefined;
        })()
        : parseFloat(exif.exposureTime))
      : undefined,
    exposureCompensation: exif?.exposureCompensation ?
      parseFloat(exif.exposureCompensation) : undefined,
    latitude: exif?.latitude || 0,
    longitude: exif?.longitude || 0,
    film: undefined,
  };
};

const dummyPhotoDb = {
  updatedAt: new Date(),
  createdAt: new Date(),
  takenAt: new Date(),
  tags: null,
  id: '',
  url: '',
  extension: '',
  takenAtNaive: new Date().toDateString(),
  aspectRatio: 1.77,
};