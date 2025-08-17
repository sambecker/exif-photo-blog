import { convertRgbToOklab, parseHex } from 'culori';
import { getNextImageUrlForManipulation } from '@/platforms/next-image';
import {
  AI_CONTENT_GENERATION_ENABLED,
  IS_PREVIEW,
} from '@/app/config';
import { FastAverageColor } from 'fast-average-color';
import { Oklch, PhotoColorData } from './client';
import sharp from 'sharp';
import { extractColors } from 'extract-colors';
import { getImageBase64FromUrl } from '../server';
import { generateOpenAiImageQuery } from '@/platforms/openai';
import { calculateColorSort } from './sort';

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
  return extractColors(data).then(colors =>
    colors.map(({ hex }) => convertHexToOklch(hex)));
};

const getColorDataFromImageUrl = async (
  url: string,
  isBatch?: boolean,
): Promise<PhotoColorData> => {
  const ai = AI_CONTENT_GENERATION_ENABLED
    ? await getColorFromAI(url, isBatch)
    : undefined;
  const average = await getAverageColorFromImageUrl(url);
  const colors = await getExtractedColorsFromImageUrl(url);
  return {
    ...ai && { ai },
    average,
    colors,
  };
};

export const getColorFieldsForImageUrl = async (
  url: string,
  _colorData?: PhotoColorData,
  isBatch?: boolean,
) => {
  try {
    const colorData = _colorData ??
      await getColorDataFromImageUrl(url, isBatch);
    return {
      colorData,
      colorSort: calculateColorSort(colorData),
    };
  } catch {
    console.log('Error fetching image url data', url);
  }
};

// Used when inserting colors into database
export const getColorFieldsForPhotoDbInsert = async (
  ...args: Parameters<typeof getColorFieldsForImageUrl>
) => {
  const { colorData, ...rest } = await getColorFieldsForImageUrl(...args) ?? {};
  if (colorData !== undefined) {
    return {
      colorData: JSON.stringify(colorData),
      ...rest,
    };
  }
};

// Used when preparing colors for form
export const getColorFieldsForPhotoForm = async (
  ...args: Parameters<typeof getColorFieldsForImageUrl>
) => {
  const { colorSort, ...rest } =
    await getColorFieldsForPhotoDbInsert(...args) ?? {};
  if (colorSort !== undefined) {
    return {
      colorSort: `${colorSort}`,
      ...rest,
    };
  }
};

export const getColorFromAI = async (
  _url: string,
  useBatch?: boolean,
) => {
  const url = getNextImageUrlForManipulation(_url, IS_PREVIEW);
  const image = await getImageBase64FromUrl(url);
  const hexColor = await generateOpenAiImageQuery(image, `
    Does this image have a primary subject color?
    If yes, what is the approximate hex color of the subject.
    If not, what is the approximate hex color of the background?
    Respond only with a hex color value:
  `, useBatch);
  const hex = hexColor?.match(/#*([a-f0-9]{6})/i)?.[1];
  if (hex) {
    return convertHexToOklch(`#${hex}`);
  }
};
