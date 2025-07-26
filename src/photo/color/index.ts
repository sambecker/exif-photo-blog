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
