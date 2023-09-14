import {
  ABSOLUTE_ROUTE_FOR_HOME_IMAGE,
  absoluteRouteForPhotoImage,
} from '@/site/routes';
import { formatDateFromPostgresString } from '@/utility/date';
import {
  formatAperture,
  formatIso,
  formatExposureCompensation,
  formatExposureTime,
  formatFocalLength,
} from '@/utility/exif';
import camelcaseKeys from 'camelcase-keys';
import { Metadata } from 'next';
import short from 'short-uuid';

const translator = short();

// Core EXIF data
export interface PhotoExif {
  aspectRatio: number
  make?: string
  model?: string
  focalLength?: number
  focalLengthIn35MmFormat?: number
  fNumber?: number
  iso?: number
  exposureTime?: number
  exposureCompensation?: number
  latitude?: number
  longitude?: number
  filmSimulation?: string
  takenAt: string
  takenAtNaive: string
}

// Raw db insert
export interface PhotoDbInsert extends PhotoExif {
  id: string
  idShort: string
  url: string
  extension: string
  blurData: string
  title?: string
  tags?: string[]
  locationName?: string
  priorityOrder?: number
}

// Raw db response
export interface PhotoDb extends Omit<PhotoDbInsert, 'takenAt' | 'tags'> {
  updatedAt: Date
  createdAt: Date
  takenAt: Date
  tags: string[]
}

// Parsed db response
export interface Photo extends PhotoDb {
  focalLengthFormatted?: string
  focalLengthIn35MmFormatFormatted?: string
  fNumberFormatted?: string
  isoFormatted?: string
  exposureTimeFormatted?: string
  exposureCompensationFormatted?: string
  takenAtNaiveFormatted?: string
}

export const parsePhotoFromDb = (photoDbRaw: PhotoDb): Photo => {
  const photoDb = camelcaseKeys(
    photoDbRaw as unknown as Record<string, unknown>
  ) as unknown as PhotoDb;
  return {
    ...photoDb,
    idShort:
      translator.fromUUID(photoDb.id),
    tags: photoDb.tags ?? [],
    focalLengthFormatted:
      formatFocalLength(photoDb.focalLength),
    focalLengthIn35MmFormatFormatted:
      formatFocalLength(photoDb.focalLengthIn35MmFormat),
    fNumberFormatted:
      formatAperture(photoDb.fNumber),
    isoFormatted:
      formatIso(photoDb.iso),
    exposureTimeFormatted:
      formatExposureTime(photoDb.exposureTime),
    exposureCompensationFormatted:
      formatExposureCompensation(photoDb.exposureCompensation),
    takenAtNaiveFormatted:
      formatDateFromPostgresString(photoDb.takenAtNaive),
  };
};

export const convertPhotoToPhotoDbInsert = (
  photo: Photo,
): PhotoDbInsert => ({
  ...photo,
  takenAt: photo.takenAt.toISOString(),
});

export const photoStatsAsString = (photo: Photo) => [
  photo.model,
  photo.focalLengthFormatted,
  photo.fNumberFormatted,
  photo.isoFormatted,
].join(' ');

export const ogImageDescriptionForPhoto = (photo: Photo) =>
  photo.takenAtNaiveFormatted?.toUpperCase();

export const getPreviousPhoto = (photo: Photo, photos: Photo[]) => {
  const index = photos.findIndex(p => p.id === photo.id);
  return index > 0
    ? photos[index - 1]
    : undefined;
};

export const getNextPhoto = (photo: Photo, photos: Photo[]) => {
  const index = photos.findIndex(p => p.id === photo.id);
  return index < photos.length - 1
    ? photos[index + 1]
    : undefined;
};

export const getPhotosLimitForQuery = (
  query?: string,
  photosPerRequest = 24,
) => {
  const offsetInt = parseInt(query ?? '0');
  const offset = (Number.isNaN(offsetInt) ? 0 : offsetInt);
  return {
    offset,
    limit: photosPerRequest + offset * photosPerRequest,
  };
};

export const generateOgImageMetaForPhotos = (photos: Photo[]): Metadata => {
  if (photos.length >= 6) {
    // Show multiple photos once a 3x2 grid is available
    return {
      openGraph: {
        images: ABSOLUTE_ROUTE_FOR_HOME_IMAGE,
      },
      twitter: {
        card: 'summary_large_image',
        images: ABSOLUTE_ROUTE_FOR_HOME_IMAGE,
      },
    };
  } else if (photos.length > 0) {
    // Otherwise show the first photo
    const photo = photos[0];
    return {
      openGraph: {
        images: absoluteRouteForPhotoImage(photo),
      },
      twitter: {
        card: 'summary_large_image',
        images: absoluteRouteForPhotoImage(photo),
      },
    };
  }
  // If there are no photos, refrain from showing an OG image
  return {};
};

const PHOTO_ID_FORWARDING_TABLE: Record<string, string> = JSON.parse(
  process.env.PHOTO_ID_FORWARDING_TABLE || '{}'
);

export const translatePhotoId = (shortId: string) => {
  const id = PHOTO_ID_FORWARDING_TABLE[shortId] || shortId;
  return id.length === 22 ? translator.toUUID(id) : id;
};

export const titleForPhoto = (photo: Photo) =>
  photo.title || 'Untitled';
