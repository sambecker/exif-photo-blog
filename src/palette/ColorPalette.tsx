'use client';

import { prominent } from 'color.js';
import { FastAverageColor } from 'fast-average-color';
import { extractColors } from 'extract-colors';
import { Photo } from '@/photo';
import { useState, useEffect } from 'react';
import { getNextImageUrlForManipulation } from '@/platforms/next-image';
import clsx from 'clsx/lite';

export default function ColorPalette({
  photo: { url },
  className,
  debug,
}: {
  photo: Photo
  className?: string
  debug?: boolean
}) {
  const [colors, setColors] = useState<string[]>([]);
  const [colorsFAC, setColorsFAC] = useState<string[]>([]);
  const [colorsExtract, setColorsExtract] = useState<string[]>([]);

  useEffect(() => {
    const getDominantColor = async () => {
      const colors = await prominent(
        getNextImageUrlForManipulation(url, false),
        { format: 'hex', amount: 8, group: 100 },
      );
      setColors(colors as string[]);
      const fac = new FastAverageColor();
      const colorsFAC = await fac.getColorAsync(
        getNextImageUrlForManipulation(url, false),
      );
      setColorsFAC([colorsFAC.hex]);
      const colorsExtract = await extractColors(
        getNextImageUrlForManipulation(url, false),
      );
      setColorsExtract(colorsExtract.map((color) => color.hex));
    };
    getDominantColor();
  }, [url]);
  
  return <div {...{ className }}>
    {colors.length > 0 &&
    <div
      className={clsx(
        'flex items-center justify-center size-7 rounded-lg',
        'border border-black/20',
      )}
      style={{ backgroundColor: colorsExtract[2] + '99' }}
    >
      <div
        className={clsx(
          'size-3 rounded-sm',
          'border border-white/40',
        )}
        style={{ backgroundColor: colorsExtract[0] }}
      />
    </div>}
    {debug && <>
      {colors.length > 0 &&
        <div className="flex gap-1 mb-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>}
      {colorsFAC.length > 0 &&
        <div className="flex gap-1 mb-4">
          {colorsFAC.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>}
      {colorsExtract.length > 0 &&
        <div className="flex gap-1 mb-4">
          {colorsExtract.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>}
    </>}
  </div>;
}
