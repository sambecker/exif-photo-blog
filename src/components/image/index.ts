import { ComponentProps } from 'react';
import ImageWithFallback from './ImageWithFallback';

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
}
