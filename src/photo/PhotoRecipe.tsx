'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import clsx from 'clsx/lite';
import { ReactNode, RefObject } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { motion } from 'framer-motion';

const addSign = (value = 0) => value < 0 ? value : `+${value}`;

export default function PhotoRecipe({
  ref,
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
  onClose,
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

  const renderRow = (children: ReactNode) =>
    <div className="flex gap-2 *:w-full *:grow">{children}</div>;

  const renderDataSquare = (
    value: ReactNode,
    label?: string,
    className?: string,
  ) => (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-0.5 rounded-md min-w-0',
      'rounded-md border',
      'border-neutral-200/40',
      'bg-neutral-100/30 hover:bg-neutral-100/50',
      label && 'p-1',
      className,
    )}>
      <div className="truncate max-w-full tracking-wide">
        {typeof value === 'number' ? addSign(value) : value}
      </div>
      {label && <div className={clsx(
        'text-[10px] leading-none tracking-wide font-medium text-black/50',
        'uppercase',
      )}>
        {label}
      </div>}
    </div>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -10 }}
      className={clsx(
        'z-10',
        'w-[19rem] p-3 space-y-3',
        'rounded-lg shadow-2xl',
        'text-[13.5px] text-black',
        'bg-white/70 border border-neutral-200/30',
        'backdrop-blur-xl saturate-[300%]',
      )}
    >
      <div className="flex items-center gap-2">
        <PhotoFilmSimulation
          contrast="frosted"
          className="grow"
          simulation={simulation}
        />
        <LoaderButton
          icon={<IoCloseCircle size={20} />}
          onClick={onClose}
          className={clsx(
            'link p-0 m-0 h-4!',
            'text-black/40 active:text-black/75',
          )}
        />
      </div>
      <div className="space-y-2">
        {renderRow(<>
          {renderDataSquare(`DR${dynamicRange.development}`)}
          {renderDataSquare(iso)}
          {renderDataSquare(exposure ?? '0ev')}
        </>)}
        {renderRow(<>
          {renderDataSquare(
            whiteBalanceTypeFormatted.toUpperCase(),
            `R${addSign(whiteBalance?.red)} / B${addSign(whiteBalance?.blue)}`,
            'basis-2/3',
          )}
          {renderDataSquare(
            highISONoiseReduction ?? noiseReductionBasic ?? 'OFF',
            'ISO NR',
            'basis-1/3',
          )}
        </>)}
        {renderRow(<>
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
    </motion.div>
  );
}
