import { NextImageSize } from '@/services/next-image';
import { getDimensionsFromSize } from '@/utility/size';

export const MAX_PHOTOS_TO_SHOW_OG = 12;
export const MAX_PHOTOS_TO_SHOW_PER_TAG = 6;
export const MAX_PHOTOS_TO_SHOW_TEMPLATE = 16;
export const MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT = 12;

interface OGImageDimension {
  width: NextImageSize
  height: number
  aspectRatio: number
}

// 16:9 og image ratio
const IMAGE_OG_RATIO = 16 / 9;
const IMAGE_OG_WIDTH: NextImageSize = 1080;
export const IMAGE_OG_DIMENSION = getDimensionsFromSize(
  IMAGE_OG_WIDTH,
  IMAGE_OG_RATIO,
) as OGImageDimension;

// 16:9 og image ratio, small
const IMAGE_OG_SMALL_WIDTH: NextImageSize = 828;
export const IMAGE_OG_DIMENSION_SMALL = getDimensionsFromSize(
  IMAGE_OG_SMALL_WIDTH,
  IMAGE_OG_RATIO,
) as OGImageDimension;

// 4:3 og grid ratio
const GRID_OG_RATIO = 4 / 3;
const GRID_OG_WIDTH: NextImageSize = 2048;
export const GRID_OG_DIMENSION = getDimensionsFromSize(
  GRID_OG_WIDTH,
  GRID_OG_RATIO,
) as OGImageDimension;
