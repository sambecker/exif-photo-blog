import { Camera } from '@/camera';
import { formatFocalLength } from '@/focal';
import { Lens } from '@/lens';
import { getNextImageUrlForRequest } from '@/services/next-image';
import { FilmSimulation } from '@/simulation';
import { HIGH_DENSITY_GRID, IS_PREVIEW, SHOW_EXIF_DATA } from '@/site/config';
import { ABSOLUTE_PATH_FOR_HOME_IMAGE } from '@/site/paths';
import { formatDate, formatDateFromPostgresString } from '@/utility/date';
import {
  formatAperture,
  formatIso,
  formatExposureCompensation,
  formatExposureTime,
} from '@/utility/exif';
import { parameterize } from '@/utility/string';
import camelcaseKeys from 'camelcase-keys';
import { isBefore } from 'date-fns';
import type { Metadata } from 'next';

export const OUTDATED_THRESHOLD = new Date('2024-06-16');

// INFINITE SCROLL: FEED
export const INFINITE_SCROLL_FEED_INITIAL =
  process.env.NODE_ENV === 'development' ? 2 : 12;
export const INFINITE_SCROLL_FEED_MULTIPLE =
  process.env.NODE_ENV === 'development' ? 2 : 24;

// INFINITE SCROLL: GRID
export const INFINITE_SCROLL_GRID_INITIAL = HIGH_DENSITY_GRID
  ? process.env.NODE_ENV === 'development' ? 12 : 24
  : process.env.NODE_ENV === 'development' ? 12 : 24;
export const INFINITE_SCROLL_GRID_MULTIPLE = HIGH_DENSITY_GRID
  ? process.env.NODE_ENV === 'development' ? 12 : 48
  : process.env.NODE_ENV === 'development' ? 12 : 48;

// Thumbnails below /p/[photoId]
export const RELATED_GRID_PHOTOS_TO_SHOW = 12;

export const DEFAULT_ASPECT_RATIO = 1.5;

export const ACCEPTED_PHOTO_FILE_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
];

export const MAX_PHOTO_UPLOAD_SIZE_IN_BYTES = 50_000_000;

// Core EXIF data
export interface PhotoExif {
  aspectRatio: number
  make?: string
  model?: string
  focalLength?: number
  focalLengthIn35MmFormat?: number
  lensMake?: string
  lensModel?: string
  fNumber?: number
  iso?: number
  exposureTime?: number
  exposureCompensation?: number
  latitude?: number
  longitude?: number
  filmSimulation?: FilmSimulation
  takenAt?: string
  takenAtNaive?: string
}

// Raw db insert
export interface PhotoDbInsert extends PhotoExif {
  id: string
  url: string
  extension: string
  blurData?: string
  title?: string
  caption?: string
  semanticDescription?: string
  tags?: string[]
  locationName?: string
  priorityOrder?: number
  hidden?: boolean
  takenAt: string
  takenAtNaive: string
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
  takenAtNaiveFormatted: string
}

export interface PhotoSetCategory {
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  focal?: number
  lens?: Lens // Unimplemented as a set
}

export interface PhotoSetAttributes {
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
}

export const parsePhotoFromDb = (photoDbRaw: PhotoDb): Photo => {
  const photoDb = camelcaseKeys(
    photoDbRaw as unknown as Record<string, unknown>,
  ) as unknown as PhotoDb;
  return {
    ...photoDb,
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

export const parseCachedPhotoDates = (photo: Photo) => ({
  ...photo,
  takenAt: new Date(photo.takenAt),
  updatedAt: new Date(photo.updatedAt),
  createdAt: new Date(photo.createdAt),
} as Photo);

export const parseCachedPhotosDates = (photos: Photo[]) =>
  photos.map(parseCachedPhotoDates);

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

export const descriptionForPhoto = (photo: Photo) =>
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

export const generateOgImageMetaForPhotos = (photos: Photo[]): Metadata => {
  if (photos.length > 0) {
    return {
      openGraph: {
        images: ABSOLUTE_PATH_FOR_HOME_IMAGE,
      },
      twitter: {
        card: 'summary_large_image',
        images: ABSOLUTE_PATH_FOR_HOME_IMAGE,
      },
    };
  } else {
    // If there are no photos, refrain from showing an OG image
    return {};
  }
};

const PHOTO_ID_FORWARDING_TABLE: Record<string, string> = JSON.parse(
  process.env.PHOTO_ID_FORWARDING_TABLE || '{}',
);

export const translatePhotoId = (id: string) =>
  PHOTO_ID_FORWARDING_TABLE[id] || id;

export const titleForPhoto = (
  photo: Photo,
  preferDateOverUntitled?: boolean,
) => {
  if (photo.title) {
    return photo.title;
  } else if (preferDateOverUntitled && (photo.takenAt || photo.createdAt)) {
    return formatDate(photo.takenAt || photo.createdAt, 'tiny');
  } else {
    return 'Untitled';
  }
};

export const altTextForPhoto = (photo: Photo) =>
  photo.semanticDescription || titleForPhoto(photo);

export const photoLabelForCount = (count: number, capitalize = true) =>
  capitalize
    ? count === 1 ? 'Photo' : 'Photos'
    : count === 1 ? 'photo' : 'photos';

export const photoQuantityText = (
  count: number,
  includeParentheses = true,
  capitalize?: boolean,
) =>
  includeParentheses
    ? `(${count} ${photoLabelForCount(count, capitalize)})`
    : `${count} ${photoLabelForCount(count, capitalize)}`;  

export const deleteConfirmationTextForPhoto = (photo: Photo) =>
  `Are you sure you want to delete "${titleForPhoto(photo)}?"`;

export type PhotoDateRange = { start: string, end: string };

export const descriptionForPhotoSet = (
  photos:Photo[] = [],
  descriptor?: string,
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) =>
  dateBased
    ? dateRangeForPhotos(photos, explicitDateRange).description.toUpperCase()
    : [
      explicitCount ?? photos.length,
      descriptor,
      photoLabelForCount(explicitCount ?? photos.length, false),
    ].join(' ');

const sortPhotosByDate = (
  photos: Photo[],
  order: 'ASC' | 'DESC' = 'DESC',
) =>
  [...photos].sort((a, b) => order === 'DESC'
    ? b.takenAt.getTime() - a.takenAt.getTime()
    : a.takenAt.getTime() - b.takenAt.getTime());

export const dateRangeForPhotos = (
  photos: Photo[] = [],
  explicitDateRange?: PhotoDateRange,
) => {
  let start = '';
  let end = '';
  let description = '';

  if (explicitDateRange || photos.length > 0) {
    const photosSorted = sortPhotosByDate(photos);
    start = formatDateFromPostgresString(
      explicitDateRange?.start ?? photosSorted[photos.length - 1].takenAtNaive,
      'short',
    );
    end = formatDateFromPostgresString(
      explicitDateRange?.end ?? photosSorted[0].takenAtNaive,
      'short',
    );
    description = start === end
      ? start
      : `${start}–${end}`;
  }

  return { start, end, description };
};

const photoHasCameraData = (photo: Photo) =>
  Boolean(photo.make) &&
  Boolean(photo.model);

const photoHasExifData = (photo: Photo) =>
  Boolean(photo.focalLength) ||
  Boolean(photo.focalLengthIn35MmFormat) ||
  Boolean(photo.fNumberFormatted) ||
  Boolean(photo.isoFormatted) ||
  Boolean(photo.exposureTimeFormatted) ||
  Boolean(photo.exposureCompensationFormatted);

export const shouldShowCameraDataForPhoto = (photo: Photo) =>
  SHOW_EXIF_DATA && photoHasCameraData(photo);

export const shouldShowExifDataForPhoto = (photo: Photo) =>
  SHOW_EXIF_DATA && photoHasExifData(photo);

export const getKeywordsForPhoto = (photo: Photo) =>
  (photo.caption ?? '').split(' ')
    .concat((photo.semanticDescription ?? '').split(' '))
    .filter(Boolean)
    .map(keyword => keyword.toLocaleLowerCase());

export const isNextImageReadyBasedOnPhotos = async (
  photos: Photo[],
): Promise<boolean> =>
  photos.length > 0 && fetch(getNextImageUrlForRequest(
    photos[0].url,
    640,
    undefined,
    undefined,
    IS_PREVIEW,
  ))
    .then(response => response.ok)
    .catch(() => false);

export const downloadFileNameForPhoto = (photo: Photo) =>
  photo.title
    ? `${parameterize(photo.title)}.${photo.extension}`
    : photo.url.split('/').pop() || 'download';

export const doesPhotoNeedBlurCompatibility = (photo: Photo) =>
  isBefore(photo.updatedAt, new Date('2024-05-07'));
