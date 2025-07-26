import { convertRgbToOklab, parseHex } from 'culori';

export interface Oklch {
  l: number
  c: number
  h: number
}

export interface PhotoColorData {
  average: Oklch
  colors: Oklch[]
}

const NULL_RGB = { r: 0, g: 0, b: 0 };

export const convertOklchToCss = (oklch: Oklch) =>
  `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;

export const convertHexToOklch = (hex: string): Oklch => {
  const rgb = parseHex(hex) ?? NULL_RGB;
  const { a, b, l } = convertRgbToOklab(rgb);
  const c = Math.sqrt(a * a + b * b);
  const _h = Math.atan2(b, a) * (180 / Math.PI);
  const h = _h < 0 ? _h + 360 : _h;
  return {
    l: +(l.toFixed(3)),
    c: +(c.toFixed(3)),
    h: +(h.toFixed(3)),
  };
};
