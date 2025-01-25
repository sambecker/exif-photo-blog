// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_SMALL = 50;
// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_MEDIUM = 300;
// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_LARGE = 1000;

export interface ImageProps {
  aspectRatio: number
  blurCompatibilityMode?: boolean
  className?: string
  imgClassName?: string
  src: string
  alt: string
  blurDataURL?: string
  priority?: boolean
}
