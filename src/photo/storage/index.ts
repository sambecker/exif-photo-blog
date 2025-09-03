export const PREFIX_PHOTO = 'photo';
export const PREFIX_UPLOAD = 'upload';

export const SUFFIX_OPTIMIZED_SM = 'sm';
export const SUFFIX_OPTIMIZED_MD = 'md';

export const EXTENSION_DEFAULT = 'jpg';
export const EXTENSION_OPTIMIZED = 'jpg';

const REGEX_UPLOAD_PATH = new RegExp(
  `(?:${PREFIX_UPLOAD})\.[a-z]{1,4}`,
  'i',
);

const REGEX_UPLOAD_ID = new RegExp(
  `.${PREFIX_UPLOAD}-([a-z0-9]+)\.[a-z]{1,4}$`,
  'i',
);

export const isUploadPathnameValid = (pathname?: string) =>
  pathname?.match(REGEX_UPLOAD_PATH);

export const getExtensionFromStorageUrl = (url: string) =>
  url.match(/.([a-z]{1,4})$/i)?.[1];

export const getIdFromStorageUrl = (url: string) =>
  url.match(REGEX_UPLOAD_ID)?.[1];
