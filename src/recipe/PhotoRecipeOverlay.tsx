'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import clsx from 'clsx/lite';
import { ReactNode, RefObject } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { motion } from 'framer-motion';
import {
  addSign,
  formatNoiseReduction,
  formatRecipe,
  formatWhiteBalance,
  RecipeProps,
} from '.';

export default function PhotoRecipeOverlay({
  ref,
  title,
  recipe,
  simulation,
  iso,
  exposure,
  onClose,
}: RecipeProps & {
  ref?: RefObject<HTMLDivElement | null>
  onClose?: () => void
}) {
  const {
    dynamicRange,
    whiteBalance,
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
  } = recipe;

  const whiteBalanceTypeFormatted = formatWhiteBalance(recipe);

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
        'w-[20rem] p-3 space-y-2',
        'rounded-lg shadow-2xl',
        'text-[13.5px] text-black',
        'bg-white/70 border border-neutral-200/30',
        'backdrop-blur-xl saturate-[300%]',
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 grow truncate">
          <div className={clsx(
            'truncate text-sm uppercase',
            'translate-y-[0.5px] tracking-wide grow',
          )}>
            {title ? formatRecipe(title) : 'Recipe'}
          </div>
          <PhotoFilmSimulation
            contrast="frosted"
            simulation={simulation}
          />
        </div>
        <LoaderButton
          icon={<IoCloseCircle size={20} />}
          onClick={onClose}
          className={clsx(
            'link p-0 m-0 h-4!',
            'text-black/40 active:text-black/75',
            'translate-y-[2.5px]',
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
            formatNoiseReduction(recipe),
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
