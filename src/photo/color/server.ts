import { getNextImageUrlForManipulation } from '@/platforms/next-image';
import { IS_PREVIEW } from '@/app/config';
import { FastAverageColor } from 'fast-average-color';
import { convertHexToOklch } from './client';
import sharp from 'sharp';
import { extractColors } from 'extract-colors';
import { PhotoColorData } from '.';

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

export const getColorsFromImageUrl = async (
  url: string,
): Promise<PhotoColorData> => {
  const average = await getAverageColorFromImageUrl(url);
  const colors = await getExtractedColorsFromImageUrl(url);
  return {
    average,
    colors: colors.map(({ hex }) => convertHexToOklch(hex)),
  };
};
