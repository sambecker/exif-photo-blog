'use client';

import { FastAverageColor } from 'fast-average-color';
import { extractColors } from 'extract-colors';
import { Photo } from '@/photo';
import { useState, useEffect } from 'react';
import { getNextImageUrlForManipulation } from '@/platforms/next-image';
import { FinalColor } from 'extract-colors/lib/types/Color';
import { convertOklchToCss, convertHexToOklch } from '.';

export default function ColorPalette({
  photo: { url },
  className,
}: {
  photo: Photo
  className?: string
}) {
  const [colorsFAC, setColorsFAC] = useState('');
  const [colorsExtract, setColorsExtract] = useState<FinalColor[]>([]);

  useEffect(() => {
    const loadColors = async () => {
      const fac = new FastAverageColor();
      const colorsFAC = await fac.getColorAsync(
        getNextImageUrlForManipulation(url, false),
      );
      setColorsFAC(colorsFAC.hex);
      const colorsExtract = await extractColors(
        getNextImageUrlForManipulation(url, false),
      );
      setColorsExtract(colorsExtract);
    };
    loadColors();
  }, [url]);
  
  return <div {...{ className }}>
    {colorsFAC.length > 0 &&
      <div className="flex gap-1 mb-4">
        <div
          className="size-4 rounded-full"
          style={{ backgroundColor: colorsFAC }}
        />
      </div>}
    {colorsExtract.length > 0 &&
      <div className="flex gap-1 mb-4">
        {colorsExtract.map((color, index) => (
          <div
            key={index}
            className="size-4 rounded-full"
            style={{
              backgroundColor: color.hex,
            }}
          />
        ))}
      </div>}
    {colorsExtract.length > 0 &&
      <div className="flex gap-1 mb-4">
        {colorsExtract
          .map((color, index) => (
            <div
              key={index}
              className="size-4 rounded-full"
              style={{
                backgroundColor: convertOklchToCss(
                  convertHexToOklch(color.hex),
                ),
              }}
            />
          ))}
      </div>}
  </div>;
}
