import { DEFAULT_ASPECT_RATIO, Photo, PhotoDbInsert } from '..';
import {
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
  validationMessageNaivePostgresDateString,
  validationMessagePostgresDateString,
} from '@/utility/date';
import { roundToNumber } from '@/utility/number';
import { convertStringToArray, parameterize } from '@/utility/string';
import { generateNanoid } from '@/utility/nanoid';
import { TAG_FAVS, getValidationMessageForTags } from '@/tag';
import { MAKE_FUJIFILM } from '@/platforms/fujifilm';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { ReactNode } from 'react';
import { FujifilmSimulation } from '@/platforms/fujifilm/simulation';
import { SelectMenuOptionType } from '@/components/SelectMenuOption';
import { COLOR_SORT_ENABLED } from '@/app/config';

type VirtualFields =
  'visibility' |
  'favorite' |
  'applyRecipeTitleGlobally' |
  'shouldStripGpsData';

export type FormFields = keyof PhotoDbInsert | VirtualFields;

export type PhotoFormData = Record<FormFields, string>

export type FieldSetType =
  'text' |
  'email' |
  'password' |
  'checkbox' |
  'textarea' |
  'hidden';

export type AnnotatedTag = {
  value: string,
  label?: string,
  icon?: ReactNode
  annotation?: string,
  annotationAria?: string,
};

export type FormMeta = {
  section: string
  label: string
  note?: string
  noteShort?: string
  required?: boolean
  excludeFromInsert?: boolean
  readOnly?: boolean
  hideModificationStatus?: boolean
  validate?: (value?: string) => string | undefined
  validateStringMaxLength?: number
  spellCheck?: boolean
  capitalize?: boolean
  hideIfEmpty?: boolean
  shouldHide?: (
    formData: Partial<PhotoFormData>,
    changedFormKeys?: (keyof PhotoFormData)[],
  ) => boolean
  loadingMessage?: string
  type?: FieldSetType
  selectOptions?: SelectMenuOptionType[]
  selectOptionsDefaultLabel?: string
  tagOptions?: AnnotatedTag[]
  tagOptionsLimit?: number
  tagOptionsLimitValidationMessage?: string
  shouldNotOverwriteWithNullDataOnSync?: boolean
  isJson?: boolean
  staticValue?: string
};

const STRING_MAX_LENGTH_SHORT = 255;
const STRING_MAX_LENGTH_LONG  = 1000;

const FORM_METADATA = (
  tagOptions?: AnnotatedTag[],
  recipeOptions?: AnnotatedTag[],
  filmOptions?: AnnotatedTag[],
  aiTextGeneration?: boolean,
  shouldStripGpsData?: boolean,
): Record<keyof PhotoFormData, FormMeta> => ({
  title: {
    section: 'text',
    label: 'title',
    capitalize: true,
    validateStringMaxLength: STRING_MAX_LENGTH_SHORT,
    shouldNotOverwriteWithNullDataOnSync: true,
  },
  caption: {
    section: 'text',
    label: 'caption',
    capitalize: true,
    validateStringMaxLength: STRING_MAX_LENGTH_LONG,
    shouldHide: ({ title, caption }) =>
      !aiTextGeneration && (!title && !caption),
  },
  tags: {
    section: 'text',
    label: 'tags',
    tagOptions,
    validate: getValidationMessageForTags,
  },
  semanticDescription: {
    section: 'text',
    type: 'textarea',
    label: 'semantic description (not visible)',
    capitalize: true,
    validateStringMaxLength: STRING_MAX_LENGTH_LONG,
    shouldHide: () => !aiTextGeneration,
  },
  visibility: {
    section: 'text',
    type: 'text',
    label: 'visibility',
    excludeFromInsert: true,
  },
  excludeFromFeeds: {
    section: 'text',
    label: 'exclude from feeds',
    type: 'hidden',
  },
  hidden: {
    section: 'text',
    label: 'hidden',
    type: 'hidden',
  },
  favorite: {
    section: 'text',
    label: 'favorite',
    type: 'checkbox',
    excludeFromInsert: true,
  },
  make: {
    section: 'exif',
    label: 'camera make',
  },
  model: {
    section: 'exif',
    label: 'camera model',
  },
  film: {
    section: 'exif',
    label: 'film',
    note: 'Intended for Fujifilm cameras and analog scans',
    noteShort: 'Fujifilm cameras / analog scans',
    tagOptions: filmOptions,
    tagOptionsLimit: 1,
    shouldNotOverwriteWithNullDataOnSync: true,
  },
  recipeTitle: {
    section: 'exif',
    label: 'recipe title',
    tagOptions: recipeOptions,
    tagOptionsLimit: 1,
    spellCheck: false,
    capitalize: false,
    shouldHide: ({ make }) => make !== MAKE_FUJIFILM,
  },
  applyRecipeTitleGlobally: {
    section: 'exif',
    label: 'apply recipe title globally',
    type: 'checkbox',
    excludeFromInsert: true,
    hideModificationStatus: true,
    shouldHide: ({ make, recipeTitle, recipeData }, changedFormKeys) =>
      !(
        make === MAKE_FUJIFILM &&
        recipeData &&
        recipeTitle &&
        changedFormKeys?.includes('recipeTitle')
      ),
  },
  recipeData: {
    section: 'exif',
    type: 'textarea',
    label: 'recipe data',
    spellCheck: false,
    capitalize: false,
    shouldHide: ({ make }) => make !== MAKE_FUJIFILM,
    shouldNotOverwriteWithNullDataOnSync: true,
    isJson: true,
    validate: value => {
      let validationMessage = undefined;
      if (value) {
        try {
          JSON.parse(value);
        } catch {
          validationMessage = 'Invalid JSON';
        }
      }
      return validationMessage;
    },
  },
  focalLength: {
    section: 'exif',
    label: 'focal length',
  },
  focalLengthIn35MmFormat: {
    section: 'exif',
    label: 'focal length 35mm-equivalent',
  },
  lensMake: { section: 'exif', label: 'lens make' },
  lensModel: { section: 'exif', label: 'lens model' },
  fNumber: { section: 'exif', label: 'aperture' },
  iso: { section: 'exif', label: 'ISO' },
  exposureTime: { section: 'exif', label: 'exposure time' },
  exposureCompensation: { section: 'exif', label: 'exposure compensation' },
  locationName: {
    section: 'exif',
    label: 'location name',
    shouldHide: () => true,
  },
  latitude: { section: 'exif', label: 'latitude' },
  longitude: { section: 'exif', label: 'longitude' },
  takenAt: {
    section: 'exif',
    label: 'taken at',
    validate: validationMessagePostgresDateString,
  },
  takenAtNaive: {
    section: 'exif',
    label: 'taken at (naive)',
    validate: validationMessageNaivePostgresDateString,
  },
  id: {
    section: 'storage',
    label: 'id',
    readOnly: true,
    hideIfEmpty: true,
  },
  url: {
    section: 'storage',
    label: 'storage url',
    readOnly: true,
  },
  extension: {
    section: 'storage',
    label: 'extension',
    readOnly: true,
  },
  blurData: {
    section: 'storage',
    label: 'blur data',
    readOnly: true,
  },
  aspectRatio: {
    section: 'storage',
    label: 'aspect ratio',
    readOnly: true,
  },
  priorityOrder: {
    section: 'misc',
    label: 'priority order',
  },
  colorData: {
    section: 'misc',
    type: 'textarea',
    label: 'color data',
    isJson: true,
    shouldHide: () => !COLOR_SORT_ENABLED,
  },
  colorSort: {
    section: 'misc',
    label: 'color sort',
    shouldHide: () => !COLOR_SORT_ENABLED,
  },
  shouldStripGpsData: {
    section: 'misc',
    label: 'strip gps data',
    type: 'hidden',
    excludeFromInsert: true,
    staticValue: shouldStripGpsData ? 'true' : 'false',
  },
});

export const FIELDS_WITH_JSON = Object.entries(FORM_METADATA())
  .filter(([_, meta]) => meta.isJson)
  .map(([key]) => key as keyof PhotoFormData);

export const FIELDS_TO_NOT_OVERWRITE_WITH_NULL_DATA_ON_SYNC =
  Object.entries(FORM_METADATA())
    .filter(([_, meta]) => meta.shouldNotOverwriteWithNullDataOnSync)
    .map(([key]) => key as keyof PhotoFormData);

export const FORM_METADATA_ENTRIES = (
  ...args: Parameters<typeof FORM_METADATA>
) =>
  (Object.entries(FORM_METADATA(...args)) as [keyof PhotoFormData, FormMeta][]);

export const FORM_METADATA_ENTRIES_BY_SECTION = (
  ...args: Parameters<typeof FORM_METADATA>
) => {
  const fields = (Object
    .entries(FORM_METADATA(...args)) as [keyof PhotoFormData, FormMeta][]);
  return fields.reduce((acc, field) => {
    const section = acc.find(s => s.section === field[1].section);
    if (section) {
      section.fields.push(field);
    } else {
      acc.push({ section: field[1].section, fields: [field] });
    }
    return acc;
  }, [] as {
    section: string
    fields: [keyof PhotoFormData, FormMeta][]
  }[]);
};

export const FORM_SECTIONS = FORM_METADATA_ENTRIES_BY_SECTION()
  .map(section => section.section);

export const convertFormKeysToLabels = (keys: (keyof PhotoFormData)[]) =>
  keys.map(key => FORM_METADATA()[key].label.toUpperCase());

export const getFormErrors = (
  formData: Partial<PhotoFormData>,
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
      (!validate?.(formData[key])) &&
      // eslint-disable-next-line max-len
      (!validateStringMaxLength || (formData[key]?.length ?? 0) <= validateStringMaxLength),
  );

export const formHasExistingAiTextContent = ({
  title,
  caption,
  tags,
  semanticDescription,
}: Partial<PhotoFormData> = {}) =>
  Boolean(title || caption || tags || semanticDescription);

// CREATE FORM DATA: FROM PHOTO

export const convertPhotoToFormData = (photo: Photo): PhotoFormData => {
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
      case 'recipeData':
        return JSON.stringify(value);
      case 'colorData':
        return JSON.stringify(value);
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

// PREPARE FORM FOR DB INSERT

export const convertFormDataToPhotoDbInsert = (
  formData: FormData | Partial<PhotoFormData>,
): PhotoDbInsert => {
  const photoForm = formData instanceof FormData
    ? Object.fromEntries(formData) as PhotoFormData
    : formData;

  // Capture tags before 'favorite' is excluded from insert
  const tags = convertStringToArray(photoForm.tags) ?? [];
  if (photoForm.favorite === 'true') {
    tags.push(TAG_FAVS);
  }

  // Parse FormData:
  // - remove server action ID
  // - remove empty strings
  // - remove fields excluded from insert
  // - trim strings
  Object.keys(photoForm).forEach(key => {
    const meta = FORM_METADATA()[key as keyof PhotoFormData];
    if (
      key.startsWith('$ACTION_ID_') ||
      (photoForm as any)[key] === '' ||
      meta?.excludeFromInsert
    ) {
      delete (photoForm as any)[key];
    } else if (typeof (photoForm as any)[key] === 'string') {
      (photoForm as any)[key] = (photoForm as any)[key].trim();
    }
  });

  return {
    ...(photoForm as PhotoFormData & {
      film?: FujifilmSimulation
      recipeData?: FujifilmRecipe
    }),
    ...!photoForm.id && { id: generateNanoid() },
    // Delete array field when empty
    tags: tags.length > 0 ? tags : undefined,
    ...photoForm.recipeTitle && {
      recipeTitle: parameterize(photoForm.recipeTitle),
    },
    // Convert form strings to numbers
    aspectRatio: photoForm.aspectRatio
      ? roundToNumber(parseFloat(photoForm.aspectRatio), 6)
      : DEFAULT_ASPECT_RATIO,
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
    colorSort: photoForm.colorSort
      ? parseInt(photoForm.colorSort)
      : undefined,
    priorityOrder: photoForm.priorityOrder
      ? parseFloat(photoForm.priorityOrder)
      : undefined,
    excludeFromFeeds: photoForm.excludeFromFeeds === 'true',
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
      (current[key as keyof PhotoFormData] ?? ''),
    ) as (keyof PhotoFormData)[];
};

export const generateTakenAtFields = (
  form?: Partial<PhotoFormData>,
): { takenAt: string, takenAtNaive: string } => ({
  takenAt: form?.takenAt || generateLocalPostgresString(),
  takenAtNaive: form?.takenAtNaive || generateLocalNaivePostgresString(),
});
