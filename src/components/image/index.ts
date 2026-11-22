import { ComponentProps } from 'react';
import {
  getNextImageUrlForRequest,
  NextImageSize,
} from '@/platforms/next-image';
import { resolveOptimizedPhotoUrlForSize } from '@/photo/storage/optimized';
import type ImageWithFallback from './ImageWithFallback';

// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_SMALL = 50;
// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_MEDIUM = 300;
// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_LARGE = 1000;

export type CustomImageProps = Omit<
  ComponentProps<typeof ImageWithFallback>,
  'blurCompatibilityLevel'
> & {
  aspectRatio: number
  blurCompatibilityMode?: boolean
};

// Guard against pre-generated derivatives whose EXIF orientation
// was stripped without rotating pixels (portrait <-> landscape flip)
export const isImageOrientationMismatched = (
  image: HTMLImageElement,
  expectedAspectRatio?: number,
) => {
  if (
    !expectedAspectRatio ||
    expectedAspectRatio <= 0 ||
    image.naturalWidth <= 0 ||
    image.naturalHeight <= 0
  ) {
    return false;
  }
  const actualAspectRatio = image.naturalWidth / image.naturalHeight;
  return (
    (expectedAspectRatio < 0.95 && actualAspectRatio > 1.05) ||
    (expectedAspectRatio > 1.05 && actualAspectRatio < 0.95)
  );
};

// Stateless props for raw <img> elements hitting /_next/image directly
// (e.g., PhotoFolder) with imperative DOM fallback to the original photo
export const getOptimizedNextImageProps = ({
  imageUrl,
  size,
  aspectRatio,
}: {
  imageUrl: string
  size: NextImageSize
  aspectRatio?: number
}): Pick<ComponentProps<'img'>, 'ref' | 'src' | 'onLoad' | 'onError'> => {
  const optimizedUrl = resolveOptimizedPhotoUrlForSize(imageUrl, size);
  const src = getNextImageUrlForRequest({
    imageUrl: optimizedUrl ?? imageUrl,
    size,
  });
  if (!optimizedUrl) {
    return { src };
  }
  const fallbackSrc = getNextImageUrlForRequest({ imageUrl, size });
  const applyFallback = (image: HTMLImageElement) => {
    if (image.getAttribute('src') !== fallbackSrc) {
      image.setAttribute('src', fallbackSrc);
    }
  };
  return {
    src,
    ref: image => {
      if (
        image?.complete && (
          image.naturalWidth === 0 ||
          isImageOrientationMismatched(image, aspectRatio)
        )
      ) {
        applyFallback(image);
      }
    },
    onLoad: event => {
      if (isImageOrientationMismatched(event.currentTarget, aspectRatio)) {
        applyFallback(event.currentTarget);
      }
    },
    onError: event => {
      applyFallback(event.currentTarget);
    },
  };
};
