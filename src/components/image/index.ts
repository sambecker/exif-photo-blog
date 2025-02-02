// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_SMALL = 50;
// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_MEDIUM = 640;
// Height determined by intrinsic photo aspect ratio
export const IMAGE_WIDTH_LARGE = 1920;

// Admin preview size - used in edit forms
export const IMAGE_WIDTH_ADMIN_PREVIEW = 400;

// Grid thumbnail sizes based on layout
export const GRID_IMAGE_SIZES = {
  sm: 400,  // 2-3 columns
  md: 640,  // 4 columns
  lg: 800,  // 6 columns
} as const;

export interface ImageProps {
  aspectRatio: number
  blurCompatibilityMode?: boolean
  className?: string
  imgClassName?: string
  src: string
  alt: string
  blurDataURL?: string
  priority?: boolean
  sizes?: string
}
