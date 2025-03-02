import {
  BASE_URL,
  IMAGE_QUALITY,
  VERCEL_BYPASS_KEY,
  VERCEL_BYPASS_SECRET,
} from '@/app/config';

// Explicity defined next.config.js `imageSizes`
type NextCustomSize = 200;

type NextImageDeviceSize = 640 | 750 | 828 | 1080 | 1200 | 1920 | 2048 | 3840;

export type NextImageSize = NextCustomSize | NextImageDeviceSize;

export const MAX_IMAGE_SIZE: NextImageSize = 3840;

export const getNextImageUrlForRequest = (
  imageUrl: string,
  size: NextImageSize,
  quality = IMAGE_QUALITY,
  baseUrl = BASE_URL,
  addBypassSecret = false,
) => {
  const url = new URL(`${baseUrl}/_next/image`);

  url.searchParams.append('url', imageUrl);
  url.searchParams.append('w', size.toString());
  url.searchParams.append('q', quality.toString());

  if (addBypassSecret && VERCEL_BYPASS_SECRET) {
    url.searchParams.append(VERCEL_BYPASS_KEY, VERCEL_BYPASS_SECRET);
  }

  return url.toString();
};

// Generate small, low-bandwidth images for quick manipulations such as
// generating blur data or image thumbnails for AI text generation
export const getNextImageUrlForManipulation = (
  imageUrl: string,
  addBypassSecret = false,
) =>
  getNextImageUrlForRequest(imageUrl, 640, 90, undefined, addBypassSecret);
