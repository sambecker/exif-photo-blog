'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import PhotoFilm from '@/film/PhotoFilm';
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
  generateRecipeText,
  RecipeProps,
} from '.';
import { TbChecklist } from 'react-icons/tb';
import CopyButton from '@/components/CopyButton';
import { labelForFilm } from '@/film';
import PhotoRecipe from './PhotoRecipe';

export default function PhotoRecipeOverlay({
  ref,
  title,
  data,
  film,
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
  } = data;

  const whiteBalanceTypeFormatted = formatWhiteBalance(data);

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

  const renderRecipeTitle =
    <div className="flex items-center gap-1.5 w-full">
      <TbChecklist
        size={17}
        className="opacity-80 translate-y-[1px]"
      />
      <div className={clsx(
        'text-[15px] uppercase',
        'translate-y-[0.5px] tracking-wide',
        'truncate max-w-full',
      )}>
        {title ? formatRecipe(title) : 'Recipe'}
      </div>
    </div>;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={clsx(
        'z-10',
        'w-[20rem] p-3 space-y-3',
        'scroll-mt-8',
        'rounded-lg shadow-2xl',
        'text-[13.5px] text-black',
        'bg-white/70 border border-neutral-200/30',
        'backdrop-blur-xl saturate-[300%]',
      )}
    >
      <div className={clsx(
        'flex items-center gap-2 h-6',
        'pl-1.5 pr-0.5',
      )}>
        <div className={clsx(
          'grow translate-y-[-0.5px]',
          title && 'hover:opacity-50 active:opacity-75',
        )}>
          {title
            ? <PhotoRecipe
              recipe={title}
              className={clsx(
                'text-[15px]',
                '[&>*>*>*]:text-black',
                'tracking-wide',
              )}
            />
            : renderRecipeTitle}
        </div>
        <CopyButton
          label={`${title
            ? `${formatRecipe(title).toLocaleUpperCase()} recipe`
            : 'Recipe'}`}
          text={generateRecipeText({ title, data, film }).join('\n')}
          iconSize={17}
          className={clsx(
            'translate-y-[1.5px]',
            'text-black/40 active:text-black/75',
            'hover:text-black/40',
          )}
          tooltip="Copy recipe text"
          tooltipColor="frosted"
        />
        <span>
          <LoaderButton
            icon={<IoCloseCircle size={20} />}
            onClick={onClose}
            className={clsx(
              'link p-0 m-0',
              'text-black/40 active:text-black/75',
            )}
          />
        </span>
      </div>
      <div className="grid grid-cols-12 gap-2">
        {/* ROW */}
        <div className="col-span-8">
          {renderDataSquare(
            <div className="flex items-center gap-1.5">
              {labelForFilm(film).medium.toLocaleUpperCase()}
              <PhotoFilm
                contrast="frosted"
                film={film}
                type="icon-only"
                className="opacity-80 translate-y-[-0.5px]"
              />
            </div>,
            undefined,
            'py-0.5',
          )}
        </div>
        {renderDataSquare(
          `DR${dynamicRange.development}`,
          undefined,
          'col-span-4 py-0.5',
        )}
        {/* ROW */}
        {renderDataSquare(
          whiteBalanceTypeFormatted.toUpperCase(),
          `R${addSign(whiteBalance?.red)} / B${addSign(whiteBalance?.blue)}`,
          'col-span-8',
        )}
        {renderDataSquare(
          formatNoiseReduction(data),
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
          formatGrain(data),
          'grain',
          'col-span-6',
        )}
        {renderDataSquare(bwAdjustment ?? 0, 'BW ADJ', 'col-span-3')}
        {renderDataSquare(bwMagentaGreen ?? 0, 'BW M/G', 'col-span-3')}
      </div>
    </motion.div>
  );
}
