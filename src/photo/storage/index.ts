import { getFileNamePartsFromStorageUrl } from '@/platforms/storage';

export const PREFIX_PHOTO = 'photo';
export const PREFIX_UPLOAD = 'upload';
export const EXTENSION_DEFAULT = 'jpg';

const OPTIMIZED_SUFFIX_SM = 'sm';
const OPTIMIZED_SUFFIX_MD = 'md';
const OPTIMIZED_SUFFIX_LG = 'lg';
const OPTIMIZED_EXTENSION = 'jpg';

const REGEX_UPLOAD_PATH = new RegExp(
  `(?:${PREFIX_UPLOAD})\.[a-z]{1,4}`,
  'i',
);

export const isUploadPathnameValid = (pathname?: string) =>
  pathname?.match(REGEX_UPLOAD_PATH);

export const getFileNamePartsFromPhotoUrl = (url: string) => {
  const parts = getFileNamePartsFromStorageUrl(url);
  const { fileName } = parts;
  const fileNameOptimizedSm =
    `${fileName}-${OPTIMIZED_SUFFIX_SM}.${OPTIMIZED_EXTENSION}`;
  const fileNameOptimizedMd =
    `${fileName}-${OPTIMIZED_SUFFIX_MD}.${OPTIMIZED_EXTENSION}`;
  const fileNameOptimizedLg =
    `${fileName}-${OPTIMIZED_SUFFIX_LG}.${OPTIMIZED_EXTENSION}`;
  return {
    ...parts,
    fileNameOptimizedSm,
    fileNameOptimizedMd,
    fileNameOptimizedLg,
  };
};

export const getPhotoFileName = (
  fileName: string,
  extension = EXTENSION_DEFAULT,
  optimize?: 'sm' | 'md' | 'lg',
) =>
  Boolean(optimize)
    ? `${fileName}-${optimize}.${OPTIMIZED_EXTENSION}`
    : `${fileName}.${extension}`;

