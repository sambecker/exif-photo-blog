export interface Oklch {
  l: number
  c: number
  h: number
}

export interface PhotoColorData {
  ai?: Oklch
  average: Oklch
  colors: Oklch[]
}

export const convertJsonStringToOklch = (jsonString = '') => {
  const matches = jsonString
    .match(/`*{ *l: *([0-9\.]+), *c: *([0-9\.]+), *h: *([0-9\.]+) *}`*/);
  if (matches &&
    matches[1] &&
    matches[2] &&
    matches[3]
  ) {
    return {
      l: parseFloat(matches[1]),
      c: parseFloat(matches[2]),
      h: parseInt(matches[3]),
    } as Oklch;
  }
};

export const convertOklchToCss = (oklch: Oklch) =>
  `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;

export const logOklch = (oklch: Oklch) =>
  `L:${oklch.l.toFixed(2)} C:${oklch.c.toFixed(2)} H:${oklch.h.toFixed(2)}`;

export const generateColorDataFromString = (colorData?: string) => {
  if (colorData) {
    try {
      return JSON.parse(colorData) as PhotoColorData;
    } catch (error) {
      console.log('Error parsing color data', error);
    }
  }
};

// Start with yellow
const HUE_MAXIMA = 80;
// Only sort sufficiently vibrant colors
const CHROMA_CUTOFF = 0.05;

export const calculateColorValues = (colorData: PhotoColorData) => {
  const colorPreferred = colorData.ai ?? colorData.average;

  const hueNormalized = colorPreferred.h >= HUE_MAXIMA
    ? 360 - Math.abs(colorPreferred.h - HUE_MAXIMA)
    : Math.abs(colorPreferred.h - HUE_MAXIMA);

  const allColors = colorData.ai ? [colorData.ai] : [];
  allColors.push(...colorData.colors, colorData.average);
  const chromaAverage = allColors.reduce(
    (acc, color) => acc + color.c, 0) / allColors.length;

  const colorSort = colorPreferred.c >= CHROMA_CUTOFF
    // Organize by hue
    ? hueNormalized + 200
    : chromaAverage > 0
      // Organize by lightness (with some chroma)
      ? colorData.average.l * 100 + 100 
      // Organize by lightness (strictly black and white)
      : colorData.average.l * 100;

  // eslint-disable-next-line max-len
  console.log(`L:${colorPreferred.l} C:${colorPreferred.c} H:${colorPreferred.h} -> SCORE:${colorSort}`);

  return {
    colorData,
    colorSort: Math.round(colorSort),
  };
};
