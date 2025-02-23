import LoaderButton from '@/components/primitives/LoaderButton';
import {
  FujifilmRecipe,
  DEFAULT_GRAIN_EFFECT,
  DEFAULT_WHITE_BALANCE,
} from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import clsx from 'clsx/lite';
import { ReactNode, useRef, RefObject } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

const addSign = (value = 0) => value < 0 ? value : `+${value}`;

export default function PhotoRecipe({
  recipe: {
    dynamicRange,
    whiteBalance = DEFAULT_WHITE_BALANCE,
    highISONoiseReduction,
    noiseReductionBasic,
    highlight,
    shadow,
    color,
    sharpness,
    clarity,
    colorChromeEffect,
    colorChromeFXBlue,
    grainEffect = DEFAULT_GRAIN_EFFECT,
    bwAdjustment,
    bwMagentaGreen,
  },
  simulation,
  iso,
  exposure,
  onClose,
  externalTriggerRef,
}: {
  recipe: FujifilmRecipe
  simulation: FilmSimulation
  iso?: string
  exposure?: string
  onClose?: () => void
  externalTriggerRef?: RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLDivElement>(null);

  useClickInsideOutside({
    htmlElements: [ref, externalTriggerRef],
    onClickOutside: onClose,
  });

  const whiteBalanceTypeFormatted = whiteBalance.type
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
      'bg-neutral-100/30 border-neutral-200/40',
      label && 'p-1',
      className,
    )}>
      <div className="truncate max-w-full">
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
    <div
      ref={ref}
      className={clsx(
        'z-10',
        'w-[18rem] p-3 space-y-3',
        'rounded-lg shadow-2xl',
        'text-[13px] text-black',
        'bg-white/60 border border-neutral-200/30',
        'backdrop-blur-xl saturate-200',
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
          {renderDataSquare(`DR${dynamicRange ?? 100}`)}
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
            grainEffect.roughness === 'off'
              ? 'NONE'
              : <>
                {grainEffect.roughness === 'strong'
                  ? 'STR'
                  : grainEffect.roughness === 'weak'
                    ? 'WK'
                    : 'OFF'}
                {'/'}
                {grainEffect.size === 'large'
                  ? 'LG'
                  : grainEffect.size === 'small'
                    ? 'SM' : 'OFF'}
              </>,
            'Grain',
          )}
          {renderDataSquare(bwAdjustment ?? 0, 'BW ADJ')}
          {renderDataSquare(bwMagentaGreen ?? 0, 'BW M/G')}
        </>)}
      </div>
    </div>
  );
}
