import { BASE_URL } from '@/site/config';

// Explicity defined next.config.js `imageSizes`
export type NextCustomSize =
  200 | 400 | 1050;
export type NextImageDeviceSize =
  640 | 750 | 828 | 1080 | 1200 | 1920 | 2048 | 3840;

export type NextImageWidth = NextCustomSize | NextImageDeviceSize;

export const getNextImageUrlForRequest = (
  imageUrl: string,
  width: NextImageWidth,
  quality = 75,
) => {
  const url = new URL(`${BASE_URL}/_next/image`);

  url.searchParams.append('url', imageUrl);
  url.searchParams.append('w', width.toString());
  url.searchParams.append('q', quality.toString());

  return url.toString();
};
