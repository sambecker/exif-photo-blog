import { convertRgbToOklab, parseHex } from 'culori';
import { getNextImageUrlForManipulation } from '@/platforms/next-image';
import { IS_PREVIEW } from '@/app/config';
import { FastAverageColor } from 'fast-average-color';
import { Oklch, PhotoColorData } from '.';
import sharp from 'sharp';
import { extractColors } from 'extract-colors';
import { Photo } from '..';

const NULL_RGB = { r: 0, g: 0, b: 0 };

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

// Convert image url to byte array
const getImageDataFromUrl = async (_url: string) => {
  const url = getNextImageUrlForManipulation(_url, IS_PREVIEW);
  const imageBuffer = await fetch(decodeURIComponent(url))
    .then(res => res.arrayBuffer());
  const image = sharp(imageBuffer);
  const { width, height } = await image.metadata();
  const buffer = await image.ensureAlpha().raw().toBuffer();
  return {
    data: new Uint8ClampedArray(buffer.buffer),
    width,
    height,
  };
};

// algorithm library: fast-average-color
const getAverageColorFromImageUrl = async (url: string) => {
  const { data } = await getImageDataFromUrl(url);
  const fac = new FastAverageColor();
  const color = fac.prepareResult(fac.getColorFromArray4(data));
  return convertHexToOklch(color.hex);
};

// algorithm library: extract-colors
const getExtractedColorsFromImageUrl = async (url: string) => {
  const data = await getImageDataFromUrl(url);
  return extractColors(data);
};

const getColorsFromImageUrl = async (
  url: string,
): Promise<PhotoColorData> => {
  const average = await getAverageColorFromImageUrl(url);
  const colors = await getExtractedColorsFromImageUrl(url);
  return {
    average,
    colors: colors.map(({ hex }) => convertHexToOklch(hex)),
  };
};

export const getColorFieldsForImageUrl = async (
  url: string,
): Promise<Partial<Photo>> => {
  const colorData = await getColorsFromImageUrl(url);
  return {
    colorData,
    // Use fast-average-color for color-based sorting
    // (store all values as integers for faster sorting)
    colorLightness: Math.round(colorData.average.l * 100),
    colorChroma: Math.round(colorData.average.c * 100),
    colorHue: Math.round(colorData.average.h),
  };
};

export const getColorFieldsForPhotoUrlFormData = async (
  ...args: Parameters<typeof getColorFieldsForImageUrl>
) => {
  const {
    colorData,
    colorLightness,
    colorChroma,
    colorHue,
  } = await getColorFieldsForImageUrl(...args);
  if (
    colorData &&
    colorLightness !== undefined &&
    colorChroma !== undefined &&
    colorHue !== undefined
  ) {
    return {
      colorData: JSON.stringify(colorData),
      colorLightness: colorLightness.toString(),
      colorChroma: colorChroma.toString(),
      colorHue: colorHue.toString(),
    };
  }
};
