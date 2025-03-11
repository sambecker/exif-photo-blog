'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import clsx from 'clsx/lite';
import { ReactNode, RefObject } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { motion } from 'framer-motion';
import {
  addSign,
  formatGrain,
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
    bwAdjustment,
    bwMagentaGreen,
  } = recipe;

  const whiteBalanceTypeFormatted = formatWhiteBalance(recipe);

  const renderDataSquare = (
    value: ReactNode,
    label?: string,
    colSpan = 'col-span-4',
  ) => (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-0.5 min-w-0',
      'rounded-md border',
      'border-neutral-200/40',
      'bg-neutral-100/30 hover:bg-neutral-100/50',
      label && 'p-1',
      colSpan,
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
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
      <div className="grid grid-cols-12 gap-2">
        {/* ROW */}
        {renderDataSquare(`DR${dynamicRange.development}`)}
        {renderDataSquare(iso)}
        {renderDataSquare(exposure ?? '0ev')}
        {/* ROW */}
        {renderDataSquare(
          whiteBalanceTypeFormatted.toUpperCase(),
          `R${addSign(whiteBalance?.red)} / B${addSign(whiteBalance?.blue)}`,
          'col-span-8',
        )}
        {renderDataSquare(
          formatNoiseReduction(recipe),
          'ISO NR',
          'col-span-4',
        )}
        {/* ROW */}
        {renderDataSquare(highlight, 'Highlight', 'col-span-6')}
        {renderDataSquare(shadow, 'Shadow', 'col-span-6')}
        {/* ROW */}
        {renderDataSquare(color, 'Color')}
        {renderDataSquare(sharpness, 'Sharpness')}
        {renderDataSquare(clarity, 'Clarity')}
        {/* ROW */}
        {renderDataSquare(
          colorChromeEffect?.toLocaleUpperCase() ?? 'N/A',
          'Color Chrome',
          'col-span-6',
        )}
        {renderDataSquare(
          colorChromeFXBlue?.toLocaleUpperCase() ?? 'N/A',
          'FX Blue',
          'col-span-6',
        )}
        {/* ROW */}
        {renderDataSquare(
          formatGrain(recipe),
          'grain',
          'col-span-6',
        )}
        {renderDataSquare(bwAdjustment ?? 0, 'BW ADJ', 'col-span-3')}
        {renderDataSquare(bwMagentaGreen ?? 0, 'BW M/G', 'col-span-3')}
      </div>
    </motion.div>
  );
}
