import { getNextImageUrlForManipulation } from '@/platforms/next-image';
import { IS_PREVIEW } from '@/app/config';
import { FastAverageColor } from 'fast-average-color';
import { convertHexToOklch } from './color';
import sharp from 'sharp';

export const getHueFromImage = async (urlString: string) => {
  const url = getNextImageUrlForManipulation(urlString, IS_PREVIEW);

  const imageBuffer = await fetch(decodeURIComponent(url))
    .then(res => res.arrayBuffer());
  const image = sharp(imageBuffer);
  const buffer = await image.ensureAlpha().raw().toBuffer();
  const pixelArray = new Uint8Array(buffer.buffer);
  
  const fac = new FastAverageColor();
  const color = fac.prepareResult(fac.getColorFromArray4(pixelArray));
  const oklch = convertHexToOklch(color.hex);
  return Math.round(oklch.h);
};
