import {
  FujifilmRecipe,
  DEFAULT_GRAIN_EFFECT,
  DEFAULT_WHITE_BALANCE,
} from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import { IoCloseCircle } from 'react-icons/io5';

const addSign = (value = 0) => value < 0 ? value : `+${value}`;

const getRandomInt = () => {
  const randomInt = Math.floor(Math.random() * 4) + 1;
  return Math.random() >= 0.5 ? randomInt : -randomInt;
};

const random = {
  highlight: getRandomInt(),
  shadow: getRandomInt(),
  color: getRandomInt(),
  sharpness: getRandomInt(),
  clarity: getRandomInt(),
  colorChromeEffect: getRandomInt(),
  colorChromeFXBlue: getRandomInt(),
};

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
  } = {},
  simulation,
  iso,
  exposure,
}: {
  recipe: FujifilmRecipe
  simulation: FilmSimulation
  iso?: string
  exposure?: string
}) {
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

  return <div className="flex gap-8">
    <div className={clsx(
      'w-[18rem] self-start',
      'p-3',
      'rounded-lg shadow-2xl',
      'bg-white/60 backdrop-blur-xl border border-neutral-200/30',
      'space-y-3',
      'text-[13px] text-black',
      'saturate-200',
    )}>
      <div className="flex items-center gap-2">
        <PhotoFilmSimulation
          contrast="frosted"
          className="grow"
          simulation={simulation}
        />
        <IoCloseCircle
          size={20}
          className="text-black/25"
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
          {renderDataSquare(highlight || random.highlight, 'Highlight')}
          {renderDataSquare(shadow || random.shadow, 'Shadow')}
        </>)}
        {renderRow(<>
          {renderDataSquare(color || random.color, 'Color')}
          {renderDataSquare(sharpness || random.sharpness, 'Sharpness')}
          {renderDataSquare(clarity || random.clarity, 'Clarity')}
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
  </div>;
}
