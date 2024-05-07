import type { ExifData } from 'ts-exif-parser';
import { Photo, PhotoDbInsert, PhotoExif } from '..';
import {
  convertTimestampToNaivePostgresString,
  convertTimestampWithOffsetToPostgresString,
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
} from '@/utility/date';
import { getAspectRatioFromExif, getOffsetFromExif } from '@/utility/exif';
import { toFixedNumber } from '@/utility/number';
import { convertStringToArray } from '@/utility/string';
import { generateNanoid } from '@/utility/nanoid';
import {
  FILM_SIMULATION_FORM_INPUT_OPTIONS,
  MAKE_FUJIFILM,
} from '@/vendors/fujifilm';
import { FilmSimulation } from '@/simulation';
import { GEO_PRIVACY_ENABLED } from '@/site/config';
import { TAG_FAVS, doesTagsStringIncludeFavs } from '@/tag';

type VirtualFields = 'favorite';

export type PhotoFormData = Record<keyof PhotoDbInsert | VirtualFields, string>;

export type FieldSetType =
  'text' |
  'email' |
  'password' |
  'checkbox' |
  'textarea';

export type AnnotatedTag = {
  value: string,
  annotation?: string,
  annotationAria?: string,
};

type FormMeta = {
  label: string
  note?: string
  required?: boolean
  excludeFromInsert?: boolean
  readOnly?: boolean
  validate?: (value?: string) => string | undefined
  validateStringMaxLength?: number
  capitalize?: boolean
  hide?: boolean
  hideIfEmpty?: boolean
  shouldHide?: (formData: Partial<PhotoFormData>) => boolean
  loadingMessage?: string
  type?: FieldSetType
  selectOptions?: { value: string, label: string }[]
  selectOptionsDefaultLabel?: string
  tagOptions?: AnnotatedTag[]
};

const STRING_MAX_LENGTH_SHORT = 255;
const STRING_MAX_LENGTH_LONG  = 1000;

const FORM_METADATA = (
  tagOptions?: AnnotatedTag[],
  aiTextGeneration?: boolean,
): Record<keyof PhotoFormData, FormMeta> => ({
  title: {
    label: 'title',
    capitalize: true,
    validateStringMaxLength: STRING_MAX_LENGTH_SHORT,
  },
  caption: {
    label: 'caption',
    capitalize: true,
    validateStringMaxLength: STRING_MAX_LENGTH_LONG,
    shouldHide: ({ title, caption }) =>
      !aiTextGeneration && (!title && !caption),
  },
  tags: {
    label: 'tags',
    tagOptions,
    validate: tags => doesTagsStringIncludeFavs(tags)
      ? `'${TAG_FAVS}' is a reserved tag`
      : undefined,
  },
  semanticDescription: {
    type: 'textarea',
    label: 'semantic description (not visible)',
    capitalize: true,
    validateStringMaxLength: STRING_MAX_LENGTH_LONG,
    hide: !aiTextGeneration,
  },
  id: { label: 'id', readOnly: true, hideIfEmpty: true },
  blurData: {
    label: 'blur data',
    readOnly: true,
  },
  url: { label: 'url', readOnly: true },
  extension: { label: 'extension', readOnly: true },
  aspectRatio: { label: 'aspect ratio', readOnly: true },
  make: { label: 'camera make' },
  model: { label: 'camera model' },
  filmSimulation: {
    label: 'fujifilm simulation',
    selectOptions: FILM_SIMULATION_FORM_INPUT_OPTIONS,
    selectOptionsDefaultLabel: 'Unknown',
    shouldHide: ({ make }) => make !== MAKE_FUJIFILM,
  },
  focalLength: { label: 'focal length' },
  focalLengthIn35MmFormat: { label: 'focal length 35mm-equivalent' },
  fNumber: { label: 'aperture' },
  iso: { label: 'ISO' },
  exposureTime: { label: 'exposure time' },
  exposureCompensation: { label: 'exposure compensation' },
  locationName: { label: 'location name', hide: true },
  latitude: { label: 'latitude' },
  longitude: { label: 'longitude' },
  takenAt: { label: 'taken at' },
  takenAtNaive: { label: 'taken at (naive)' },
  priorityOrder: { label: 'priority order' },
  favorite: { label: 'favorite', type: 'checkbox', excludeFromInsert: true },
  hidden: { label: 'hidden', type: 'checkbox' },
});

export const FORM_METADATA_ENTRIES = (
  ...args: Parameters<typeof FORM_METADATA>
) =>
  (Object.entries(FORM_METADATA(...args)) as [keyof PhotoFormData, FormMeta][])
    .filter(([_, meta]) => !meta.hide);

export const convertFormKeysToLabels = (keys: (keyof PhotoFormData)[]) =>
  keys.map(key => FORM_METADATA()[key].label.toUpperCase());

export const getFormErrors = (
  formData: Partial<PhotoFormData>
): Partial<Record<keyof PhotoFormData, string>> =>
  Object.keys(formData).reduce((acc, key) => ({
    ...acc,
    [key]: FORM_METADATA_ENTRIES().find(([k]) => k === key)?.[1]
      .validate?.(formData[key as keyof PhotoFormData]),
  }), {});

export const isFormValid = (formData: Partial<PhotoFormData>) =>
  FORM_METADATA_ENTRIES().every(
    ([key, { required, validate, validateStringMaxLength }]) =>
      (!required || Boolean(formData[key])) &&
      (validate?.(formData[key]) === undefined) &&
      // eslint-disable-next-line max-len
      (!validateStringMaxLength || (formData[key]?.length ?? 0) <= validateStringMaxLength) &&
      (key !== 'tags' || !doesTagsStringIncludeFavs(formData.tags ?? ''))
  );

export const formHasTextContent = ({
  title,
  caption,
  tags,
  semanticDescription,
}: Partial<PhotoFormData>) =>
  Boolean(title || caption || tags || semanticDescription);

// CREATE FORM DATA: FROM PHOTO

export const convertPhotoToFormData = (
  photo: Photo,
): PhotoFormData => {
  const valueForKey = (key: keyof Photo, value: any) => {
    switch (key) {
    case 'tags':
      return (value ?? [])
        .filter((tag: string) => tag !== TAG_FAVS)
        .join(', ');
    case 'takenAt':
      return value?.toISOString ? value.toISOString() : value;
    case 'hidden':
      return value ? 'true' : 'false';
    default:
      return value !== undefined && value !== null
        ? value.toString()
        : undefined;
    }
  };
  return Object.entries(photo).reduce((photoForm, [key, value]) => ({
    ...photoForm,
    [key]: valueForKey(key as keyof Photo, value),
  }), {
    favorite: photo.tags.includes(TAG_FAVS) ? 'true' : 'false',
  } as PhotoFormData);
};

// CREATE FORM DATA: FROM EXIF

export const convertExifToFormData = (
  data: ExifData,
  filmSimulation?: FilmSimulation,
): Omit<
  Record<keyof PhotoExif, string | undefined>,
  'takenAt' | 'takenAtNaive'
> => ({
  aspectRatio: getAspectRatioFromExif(data).toString(),
  make: data.tags?.Make,
  model: data.tags?.Model,
  focalLength: data.tags?.FocalLength?.toString(),
  focalLengthIn35MmFormat: data.tags?.FocalLengthIn35mmFormat?.toString(),
  fNumber: data.tags?.FNumber?.toString(),
  iso: data.tags?.ISO?.toString(),
  exposureTime: data.tags?.ExposureTime?.toString(),
  exposureCompensation: data.tags?.ExposureCompensation?.toString(),
  latitude:
    !GEO_PRIVACY_ENABLED ? data.tags?.GPSLatitude?.toString() : undefined,
  longitude:
    !GEO_PRIVACY_ENABLED ? data.tags?.GPSLongitude?.toString() : undefined,
  filmSimulation,
  ...data.tags?.DateTimeOriginal && {
    takenAt: convertTimestampWithOffsetToPostgresString(
      data.tags.DateTimeOriginal,
      getOffsetFromExif(data),
    ),
    takenAtNaive:
      convertTimestampToNaivePostgresString(data.tags.DateTimeOriginal),
  },
});

// PREPARE FORM FOR DB INSERT

export const convertFormDataToPhotoDbInsert = (
  formData: FormData | PhotoFormData,
  generateId?: boolean,
): PhotoDbInsert => {
  const photoForm = formData instanceof FormData
    ? Object.fromEntries(formData) as PhotoFormData
    : formData;

  const tags = convertStringToArray(photoForm.tags) ?? [];
  if (photoForm.favorite === 'true') {
    tags.push(TAG_FAVS);
  }
  
  // Parse FormData:
  // - remove server action ID
  // - remove empty strings
  Object.keys(photoForm).forEach(key => {
    const meta = FORM_METADATA()[key as keyof PhotoFormData];
    if (
      key.startsWith('$ACTION_ID_') ||
      (photoForm as any)[key] === '' ||
      meta?.excludeFromInsert
    ) {
      delete (photoForm as any)[key];
    }
  });

  return {
    ...(photoForm as PhotoFormData & { filmSimulation?: FilmSimulation }),
    ...(generateId && !photoForm.id) && { id: generateNanoid() },
    // Convert form strings to arrays
    tags: tags.length > 0 ? tags : undefined,
    // Convert form strings to numbers
    aspectRatio: toFixedNumber(parseFloat(photoForm.aspectRatio), 6),
    focalLength: photoForm.focalLength
      ? parseInt(photoForm.focalLength)
      : undefined,
    focalLengthIn35MmFormat: photoForm.focalLengthIn35MmFormat
      ? parseInt(photoForm.focalLengthIn35MmFormat)
      : undefined,
    fNumber: photoForm.fNumber
      ? parseFloat(photoForm.fNumber)
      : undefined,
    latitude: photoForm.latitude
      ? parseFloat(photoForm.latitude)
      : undefined,
    longitude: photoForm.longitude
      ? parseFloat(photoForm.longitude)
      : undefined,
    iso: photoForm.iso
      ? parseInt(photoForm.iso)
      : undefined,
    exposureTime: photoForm.exposureTime
      ? parseFloat(photoForm.exposureTime)
      : undefined,
    exposureCompensation: photoForm.exposureCompensation
      ? parseFloat(photoForm.exposureCompensation)
      : undefined,
    priorityOrder: photoForm.priorityOrder
      ? parseFloat(photoForm.priorityOrder)
      : undefined,
    hidden: photoForm.hidden === 'true',
    ...generateTakenAtFields(photoForm),
  };
};

export const getChangedFormFields = (
  original: Partial<PhotoFormData>,
  current: Partial<PhotoFormData>,
) => {
  return Object
    .keys(current)
    .filter(key =>
      (original[key as keyof PhotoFormData] ?? '') !==
      (current[key as keyof PhotoFormData] ?? '')
    ) as (keyof PhotoFormData)[];
};

export const generateTakenAtFields = (
  form?: Partial<PhotoFormData>
): { takenAt: string, takenAtNaive: string } => ({
  takenAt: form?.takenAt || generateLocalPostgresString(),
  takenAtNaive: form?.takenAtNaive || generateLocalNaivePostgresString(),
});
