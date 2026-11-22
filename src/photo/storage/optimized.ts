import type { NextImageSize } from '@/platforms/next-image';
import { getFileNamePartsFromStorageUrl } from '@/platforms/storage/url';

// Kept free of storage SDK imports so client components can resolve urls

export const PREFIX_PHOTO = 'photo';

const EXTENSION_OPTIMIZED = 'jpg';

// For the time being, make compatible with `next/image` sizes
export const OPTIMIZED_FILE_SIZES = [{
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

export type OptimizedSuffix =
  (typeof OPTIMIZED_FILE_SIZES)[number]['suffix'];

export const getOptimizedFileName = ({
  fileNameBase,
  suffix,
}: {
  fileNameBase: string
  suffix: OptimizedSuffix
}) =>
  `${fileNameBase}-${suffix}.${EXTENSION_OPTIMIZED}`;

export const getOptimizedUrl =({
  urlBase,
  fileNameBase,
  suffix,
}: {
  urlBase: string
  fileNameBase: string
  suffix: OptimizedSuffix
}) =>
  `${urlBase}/${getOptimizedFileName({ fileNameBase, suffix })}`;

const MAX_OPTIMIZED_THUMBNAIL_SIZE = 640;

export const resolveOptimizedPhotoUrlForSize = (
  url: string,
  maxWidth: number,
): string | undefined => {
  if (!(maxWidth > 0) || maxWidth > MAX_OPTIMIZED_THUMBNAIL_SIZE) {
    return undefined;
  }
  const match = OPTIMIZED_FILE_SIZES.find(({ size }) => size >= maxWidth);
  if (!match) { return undefined; }
  const { urlBase, fileNameBase } = getFileNamePartsFromStorageUrl(url);
  if (
    urlBase &&
    fileNameBase.startsWith(`${PREFIX_PHOTO}-`) &&
    !OPTIMIZED_FILE_SIZES.some(s => fileNameBase.endsWith(`-${s.suffix}`))
  ) {
    return getOptimizedUrl({ urlBase, fileNameBase, suffix: match.suffix });
  }
};
