import { getNextImageUrlForManipulation } from '@/platforms/next-image';
import { FastAverageColor } from 'fast-average-color';
import { extractColors } from 'extract-colors';
import { parseHex, convertRgbToOklab, Rgb } from 'culori';

const RGB_DEFAULT: Rgb = { mode: 'rgb', r: 0, g: 0, b: 0 };

export const getColorsFromImage = async (
  urlString: string,
  addBypassSecret = true,
) => {
  const url = getNextImageUrlForManipulation(urlString, addBypassSecret);
  const fac = new FastAverageColor();
  const colorFac = await fac.getColorAsync(url);
  const average = colorFac.hex;
  const colors = await extractColors(url);
  return {
    average: convertHexToOklchCss(average),
    background: convertHexToOklchCss(colors[2].hex || average),
    accent: convertHexToOklchCss(colors[0].hex || average),
  };
};

const convertHexToOklch = (hex: string) => {
  const rgb: Rgb = parseHex(hex) ?? RGB_DEFAULT;
  const { a, b, l } = convertRgbToOklab(rgb);
  const c = Math.sqrt(a * a + b * b);
  const _h = Math.atan2(b, a) * (180 / Math.PI);
  const h = _h < 0 ? _h + 360 : _h;
  return { l, c, h };
};

const convertHexToOklchCss = (hex: string) => {
  const oklch = convertHexToOklch(hex);
  return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
};

