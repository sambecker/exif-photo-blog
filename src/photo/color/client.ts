import { Photo } from '..';

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

const isOklch = (value: unknown): value is Oklch =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Oklch).l === 'number' &&
  typeof (value as Oklch).c === 'number' &&
  typeof (value as Oklch).h === 'number' &&
  !Number.isNaN((value as Oklch).l) &&
  !Number.isNaN((value as Oklch).c) &&
  !Number.isNaN((value as Oklch).h);

export const convertJsonStringToOklch = (jsonString = '') => {
  const trimmed = jsonString.trim();
  if (!trimmed) { return; }

  try {
    const parsed = JSON.parse(trimmed);
    if (isOklch(parsed)) { return parsed; }
  } catch {
    // Fall through to `{ l, c, h }` object-literal format
  }

  const matches = trimmed
    .match(/`*{ *l: *([0-9.]+), *c: *([0-9.]+), *h: *([0-9.]+) *}`*/);
  if (matches?.[1] && matches[2] && matches[3]) {
    const oklch = {
      l: parseFloat(matches[1]),
      c: parseFloat(matches[2]),
      h: parseFloat(matches[3]),
    };
    if (isOklch(oklch)) { return oklch; }
  }
};

export const convertOklchToJsonString = (oklch?: Oklch) =>
  oklch
    ? JSON.stringify({ c: oklch.c, h: oklch.h, l: oklch.l })
    : '';

export const applyAiColorToColorData = (
  colorData: PhotoColorData,
  ai?: Oklch,
): PhotoColorData => {
  if (ai) {
    return { ...colorData, ai };
  } else {
    const { ai: _ai, ...rest } = colorData;
    return rest;
  }
};

export const convertOklchToCss = (oklch: Oklch, alpha?: number) =>
  alpha === undefined
    ? `oklch(${oklch.l} ${oklch.c} ${oklch.h})`
    : `oklch(${oklch.l} ${oklch.c} ${oklch.h} / ${alpha})`;

export const getKeyColorFromColorData = (colorData?: PhotoColorData) =>
  colorData?.ai ?? colorData?.colors[0];

export const getKeyColorFromPhoto = (photo?: Photo): Oklch | undefined =>
  getKeyColorFromColorData(photo?.colorData);

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
