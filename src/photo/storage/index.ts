import {
  getNextImageUrlForRequest,
  NextImageSize,
} from '@/platforms/next-image';
import {
  generateFileNameWithId,
  getFileNamePartsFromStorageUrl,
  getStorageUrlsForPrefix,
  uploadFileFromClient,
} from '@/platforms/storage';
import { Photo } from '..';

const PREFIX_PHOTO = 'photo';
const PREFIX_UPLOAD = 'upload';

const EXTENSION_DEFAULT = 'jpg';
const EXTENSION_OPTIMIZED = 'jpg';

// For the time being, make compatible with `next/image` sizes
const OPTIMIZED_FILE_SIZES = [{
  suffix: 'sm',
  size: 200,
  quality: 90,
}, {
  suffix: 'md',
  size: 640,
  quality: 90,
}, {
  suffix: 'lg',
  size: 1080,
  quality: 80,
}] as const satisfies {
  suffix: string
  size: NextImageSize
  quality: number
}[];

type OptimizedSuffix = (typeof OPTIMIZED_FILE_SIZES)[number]['suffix'];

const OPTIMIZED_SUFFIX_DEFAULT: OptimizedSuffix = 'md';

const getOptimizedFileName = ({
  fileNameBase,
  suffix,
}: {
  fileNameBase: string
  suffix: OptimizedSuffix
}) =>
  `${fileNameBase}-${suffix}.${EXTENSION_OPTIMIZED}`;

const getOptimizedUrl =({
  urlBase,
  fileNameBase,
  suffix,
}: {
  urlBase: string
  fileNameBase: string
  suffix: OptimizedSuffix
}) =>
  `${urlBase}/${getOptimizedFileName({ fileNameBase, suffix })}`;

export const getOptimizedPhotoFileMeta = (fileNameBase: string) =>
  OPTIMIZED_FILE_SIZES.map(({ suffix, ...rest }) => ({
    ...rest,
    fileName: getOptimizedFileName({ fileNameBase, suffix }),
  }));

export const getOptimizedUrlsFromPhotoUrl = (url: string) => {
  const { urlBase, fileNameBase } = getFileNamePartsFromStorageUrl(url);
  return getOptimizedPhotoFileMeta(fileNameBase).map(({ fileName }) =>
    `${urlBase}/${fileName}`);
};

export const isUploadPathnameValid = (pathname?: string) =>
  pathname?.match(new RegExp(`(?:${PREFIX_UPLOAD})\.[a-z]{1,4}`, 'i'));

export const generateRandomFileNameForPhoto = () =>
  generateFileNameWithId(PREFIX_PHOTO);

export const getStorageUploadUrls = () =>
  getStorageUrlsForPrefix(`${PREFIX_UPLOAD}-`);

export const getStoragePhotoUrls = () =>
  getStorageUrlsForPrefix(`${PREFIX_PHOTO}-`);

export const uploadPhotoFromClient = (
  file: File | Blob,
  extension = EXTENSION_DEFAULT,
) =>
  uploadFileFromClient(file, PREFIX_UPLOAD, extension);

const getSuffixFromNextImageSize = (nextSize: NextImageSize) =>
  OPTIMIZED_FILE_SIZES.find(({ size }) => size === nextSize)?.suffix
    ?? OPTIMIZED_SUFFIX_DEFAULT;

export const getOptimizedPhotoUrl = (
  args: Parameters<typeof getNextImageUrlForRequest>[0] & {
    compatibilityMode?: boolean
  },
) => {
  const { compatibilityMode = true } = args;
  const suffix = getSuffixFromNextImageSize(args.size);
  const {
    urlBase,
    fileNameBase,
  } = getFileNamePartsFromStorageUrl(args.imageUrl);
  return compatibilityMode
    ? getNextImageUrlForRequest(args)
    : getOptimizedUrl({ urlBase, fileNameBase, suffix });
};

// Generate small, low-bandwidth images for quick manipulations such as
// generating blur data or image thumbnails for AI text generation
export const getOptimizedPhotoUrlForManipulation = (
  imageUrl: string,
  addBypassSecret: boolean,
  compatibilityMode?: boolean,
) =>
  getOptimizedPhotoUrl({
    imageUrl,
    size: 640,
    addBypassSecret,
    compatibilityMode,
  });

const getTestOptimizedPhotoUrl = (url: string) => {
  const { urlBase, fileNameBase } = getFileNamePartsFromStorageUrl(url);
  return getOptimizedUrl({
    urlBase,
    fileNameBase,
    suffix: 'sm',
  });
};

export const doesPhotoUrlHaveOptimizedFiles = async (url: string) =>
  fetch(getTestOptimizedPhotoUrl(url)).then(res => res.ok);

export const doAllPhotosHaveOptimizedFiles = async (photos: Photo[]) =>
  Promise.all(photos.map(({ url }) => fetch(getTestOptimizedPhotoUrl(url))))
    .then(urls => urls.every(url => url.ok))
    .catch(() => false);

export const getStorageUrlsForPhoto = async ({ url }: Photo) => {
  const getSortScoreForUrl = (url: string) => {
    const { fileNameBase } = getFileNamePartsFromStorageUrl(url);
    if (fileNameBase.endsWith('-sm')) { return 1; }
    if (fileNameBase.endsWith('-md')) { return 2; }
    if (fileNameBase.endsWith('-lg')) { return 3; }
    return 0;
  };

  const { fileNameBase } = getFileNamePartsFromStorageUrl(url);

  return getStorageUrlsForPrefix(fileNameBase).then(urls =>
    urls.sort((a, b) => getSortScoreForUrl(a.url) - getSortScoreForUrl(b.url)),
  );
};
