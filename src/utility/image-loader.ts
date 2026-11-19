'use client';

// Custom `next/image` loader that serves pre-generated optimized photo
// variants instead of feeding the full-resolution original through the
// on-demand `/_next/image` optimizer.
//
// Photos are stored as `photo-<id>.<ext>` originals with pre-generated
// `photo-<id>-sm|md|lg.jpg` derivatives (see src/photo/storage/index.ts).
// Serving the derivative directly avoids downloading the (often ~30 MB)
// original on every cold cache miss in the grid.

const OPTIMIZED_SIZES = [
  { suffix: 'sm', width: 200 },
  { suffix: 'md', width: 640 },
  { suffix: 'lg', width: 1080 },
] as const;

const LARGEST_SUFFIX =
  OPTIMIZED_SIZES[OPTIMIZED_SIZES.length - 1].suffix;

// Matches storage photo URLs, e.g.
//   .../photo-rFgmziSu3D4Qh6qT.jpg        (original)
//   .../photo-rFgmziSu3D4Qh6qT-md.jpg     (already optimized)
const PHOTO_URL_PATTERN =
  /^(.*)\/(photo-[a-z0-9]+)(?:-(sm|md|lg))?\.([a-z]{1,4})$/i;

type ImageLoaderProps = {
  src: string
  width: number
  quality?: number
};

const getDefaultImageUrl = (
  src: string,
  width: number,
  quality?: number,
) => {
  const url = encodeURIComponent(src);
  return `/_next/image?url=${url}&w=${width}&q=${quality || 75}`;
};

// Resolve the pre-generated variant URL for a photo source, or return
// `undefined` for non-photo sources (data URLs, QR codes, etc.).
export function getOptimizedVariantUrl(
  src: string,
  width: number,
): string | undefined {
  if (typeof src !== 'string' || src.startsWith('data:')) {
    return undefined;
  }

  const match = src.match(PHOTO_URL_PATTERN);
  if (!match) {
    return undefined;
  }

  const urlBase = match[1];
  const fileNameBase = match[2];
  const extension = match[4];

  // Already pointing at an optimized variant — leave it alone.
  if (match[3]) {
    return src;
  }

  // Smallest variant that covers the requested width; widths beyond what we
  // pre-generate (e.g. full-frame retina) cap at the largest variant rather
  // than falling back to the on-demand optimizer, which would re-download
  // the full-resolution original.
  const suffix =
    OPTIMIZED_SIZES.find(({ width: w }) => width <= w)?.suffix
    ?? LARGEST_SUFFIX;

  return `${urlBase}/${fileNameBase}-${suffix}.${extension}`;
}

export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  if (typeof src !== 'string' || src.startsWith('data:')) {
    return src;
  }
  return getOptimizedVariantUrl(src, width)
    ?? getDefaultImageUrl(src, width, quality);
}

// Reproduces the default `/_next/image` optimizer URL. Used to re-try the
// original source when a pre-generated variant is missing.
export function originalImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return getDefaultImageUrl(src, width, quality);
}
