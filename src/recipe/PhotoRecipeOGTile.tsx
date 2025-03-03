'use client';

import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import clsx from 'clsx/lite';
import { ReactNode, RefObject } from 'react';

const addSign = (value = 0) => value < 0 ? value : `+${value}`;

export default function PhotoRecipeOGTile({
  recipe: {
    dynamicRange,
    whiteBalance,
    highISONoiseReduction,
    noiseReductionBasic,
    highlight,
    shadow,
    color,
    sharpness,
    clarity,
    colorChromeEffect,
    colorChromeFXBlue,
    grainEffect,
    bwAdjustment,
    bwMagentaGreen,
  },
  simulation,
  iso,
  exposure,
}: {
  ref?: RefObject<HTMLDivElement | null>
  recipe: FujifilmRecipe
  simulation: FilmSimulation
  iso?: string
  exposure?: string
  onClose?: () => void
}) {
  const whiteBalanceTypeFormatted =
    whiteBalance.type === 'kelvin' && whiteBalance.colorTemperature
      ? `${whiteBalance.colorTemperature}K`
      : whiteBalance.type
        .replace(/auto./i, '')
        .replaceAll('-', ' ');

  const renderRow = (children: ReactNode, className?: string) =>
    <div className={clsx(
      'flex gap-2 *:w-full *:grow',
      className,
    )}>
      {children}
    </div>;

  const renderDataSquare = (
    value: ReactNode,
    label?: string,
    className?: string,
  ) => (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-0.5 rounded-md min-w-0',
      'rounded-md border',
      'border-transparent',
      'bg-neutral-100/60',
      label && 'p-1',
      className,
    )}>
      <div className="truncate max-w-full tracking-wide text-lg">
        {typeof value === 'number' ? addSign(value) : value}
      </div>
      {label && <div className={clsx(
        'text-[11px] leading-none tracking-wide font-medium text-black/50',
        'uppercase',
      )}>
        {label}
      </div>}
    </div>
  );

  return (
    <div
      className={clsx(
        'flex z-10',
        'w-[37rem] p-10 aspect-video',
        'text-[13.5px] text-black',
        'bg-white/50',
        'backdrop-blur-xl saturate-[300%]',
      )}
    >
      <div className="flex flex-col gap-2 w-full">
        {renderRow(<>
          <div className={clsx(
            'flex',
            'text-lg leading-none text-black truncate',
          )}>
            KODAK PORTRA 500
          </div>
          <PhotoFilmSimulation
            contrast="frosted"
            simulation={simulation}
            className="w-auto! grow-0!"
          />
        </>, 'flex items-center gap-4')}
        {renderRow(<>
          {renderDataSquare(`DR${dynamicRange.development}`)}
          {renderDataSquare(iso)}
          {renderDataSquare(exposure ?? '0ev')}
        </>)}
        {renderRow(<>
          {renderDataSquare(
            whiteBalanceTypeFormatted.toUpperCase(),
            `R${addSign(whiteBalance?.red)} / B${addSign(whiteBalance?.blue)}`,
          )}
          {renderDataSquare(
            highISONoiseReduction ?? noiseReductionBasic ?? 'OFF',
            'ISO NR',
          )}
          {renderDataSquare(highlight, 'Highlight')}
          {renderDataSquare(shadow, 'Shadow')}
        </>)}
        {renderRow(<>
          {renderDataSquare(color, 'Color')}
          {renderDataSquare(sharpness, 'Sharpness')}
          {renderDataSquare(clarity, 'Clarity')}
        </>)}
        {renderRow(<>
          {renderDataSquare(
            colorChromeEffect?.toLocaleUpperCase() ?? 'N/A',
            'Color Chrome',
          )}
          {renderDataSquare(
            colorChromeFXBlue?.toLocaleUpperCase() ?? 'N/A',
            'FX Blue',
          )}
        </>)}
        {renderRow(<>
          {renderDataSquare(
            grainEffect.roughness.toLocaleUpperCase(),
            grainEffect.size === 'large'
              ? 'Large Grain'
              : grainEffect.size === 'small'
                ? 'Small Grain'
                : 'Grain',
          )}
          {renderDataSquare(bwAdjustment ?? 0, 'BW ADJ')}
          {renderDataSquare(bwMagentaGreen ?? 0, 'BW M/G')}
        </>)}
      </div>
    </div>
  );
}
