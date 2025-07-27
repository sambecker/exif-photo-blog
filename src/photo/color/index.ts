export interface Oklch {
  l: number
  c: number
  h: number
}

export interface PhotoColorData {
  average: Oklch
  colors: Oklch[]
}

export const convertOklchToCss = (oklch: Oklch) =>
  `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;

export const logOklch = (oklch: Oklch) =>
  `L:${oklch.l.toFixed(2)} C:${oklch.c.toFixed(2)} H:${oklch.h.toFixed(2)}`;
