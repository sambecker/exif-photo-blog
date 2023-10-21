import { NextImageSize } from '@/utility/image';

export const MAX_PHOTOS_TO_SHOW_OG = 12;
export const MAX_PHOTOS_TO_SHOW_PER_TAG = 6;
export const MAX_PHOTOS_TO_SHOW_TEMPLATE = 16;
export const MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT = 12;

// 16:9 og image ratio
const IMAGE_OG_RATIO = 16 / 9;
const IMAGE_OG_WIDTH: NextImageSize = 1200;
const IMAGE_OG_HEIGHT = IMAGE_OG_WIDTH * (1 / IMAGE_OG_RATIO);
export const IMAGE_OG_SIZE = {
  width: IMAGE_OG_WIDTH,
  height: IMAGE_OG_HEIGHT,
  ratio: IMAGE_OG_RATIO,
};

// 16:9 og image ratio, small
const IMAGE_OG_SMALL_WIDTH = 800;
const IMAGE_OG_SMALL_HEIGHT = IMAGE_OG_SMALL_WIDTH * (1 / IMAGE_OG_RATIO);
export const IMAGE_OG_SMALL_SIZE = {
  width: IMAGE_OG_SMALL_WIDTH,
  height: IMAGE_OG_SMALL_HEIGHT,
  ratio: IMAGE_OG_RATIO,
};

// 3:2 og grid ratio
const GRID_OG_RATIO = 1.33;
const GRID_OG_WIDTH = 2000;
const GRID_OG_HEIGHT = GRID_OG_WIDTH * (1 / GRID_OG_RATIO);
export const GRID_OG_SIZE = {
  width: GRID_OG_WIDTH,
  height: GRID_OG_HEIGHT,
  ratio: GRID_OG_RATIO,
};
