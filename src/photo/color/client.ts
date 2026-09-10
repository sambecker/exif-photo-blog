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

export const convertOklchToCss = (oklch: Oklch, alpha?: number) =>
  alpha === undefined
    ? `oklch(${oklch.l} ${oklch.c} ${oklch.h})`
    : `oklch(${oklch.l} ${oklch.c} ${oklch.h} / ${alpha})`;

export const getProminentColorFromPhotos = (
  photos: { colorData?: PhotoColorData }[],
): Oklch | undefined => {
  let prominent: Oklch | undefined;
  for (const { colorData } of photos) {
    if (!colorData) { continue; }
    const color = colorData.colors[0]
      ?? colorData.ai
      ?? colorData.average;
    if (color && (prominent === undefined || color.c > prominent.c)) {
      prominent = color;
    }
  }
  return prominent;
};

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
