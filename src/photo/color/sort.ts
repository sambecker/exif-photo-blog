import {
  COLOR_SORT_STARTING_HUE,
  COLOR_SORT_CHROMA_CUTOFF,
} from '@/app/config';
import { PhotoColorData } from './client';

// Start with yellow
const DEFAULT_HUE_MAXIMA = 80;
// Only sort sufficiently vibrant colors
const DEFAULT_CHROMA_CUTOFF = 0.05;

const SECTION_OFFSET_HUE = 200;
const SECTION_OFFSET_LOW_CHROMA = 100;
const SECTION_OFFSET_BLACK_AND_WHITE = 0;

export const parseStartingHue = (hueMaxima = '') => {
  const hueMaximaInt = parseInt(hueMaxima);
  return isNaN(hueMaximaInt) ? DEFAULT_HUE_MAXIMA : hueMaximaInt;
};

export const parseChromaCutoff = (chromaCutoff = '') => {
  const chromaCutoffFloat = parseFloat(chromaCutoff);
  return isNaN(chromaCutoffFloat) ? DEFAULT_CHROMA_CUTOFF : chromaCutoffFloat;
};

export const calculateColorSort = (colorData: PhotoColorData) => {
  // Prefer AI-generated colors when available
  const colorPreferred = colorData.ai ?? colorData.average;

  // Re-center hues based on start point
  const hueNormalized = colorPreferred.h >= COLOR_SORT_STARTING_HUE
    ? 360 - Math.abs(colorPreferred.h - COLOR_SORT_STARTING_HUE)
    : Math.abs(colorPreferred.h - COLOR_SORT_STARTING_HUE);

  // Analyze average chroma to determine if colors are sufficiently vibrant
  const allColors = colorData.ai ? [colorData.ai] : [];
  allColors.push(...colorData.colors, colorData.average);
  const chromaAverage = allColors.reduce(
    (acc, color) => acc + color.c, 0) / allColors.length;

  const colorSort = colorPreferred.c >= COLOR_SORT_CHROMA_CUTOFF
    // Organize by hue
    ? hueNormalized + SECTION_OFFSET_HUE
    : chromaAverage > 0
      // Organize by lightness (with some chroma)
      ? colorData.average.l * 100 + SECTION_OFFSET_LOW_CHROMA
      // Organize by lightness (strictly black and white)
      : colorData.average.l * 100 + SECTION_OFFSET_BLACK_AND_WHITE;

  return Math.round(colorSort);
};
