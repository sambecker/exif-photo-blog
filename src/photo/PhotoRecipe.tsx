import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import clsx from 'clsx/lite';
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
  exposure,
  iso,
}: {
  recipe: FujifilmRecipe
  simulation: FilmSimulation
  exposure?: string
  iso?: string
}) {
  const whiteBalanceFormatted = (whiteBalance?.type ?? 'auto')
    .replaceAll('auto', ' ')
    .replaceAll('-', ' ');

  const hasBWAdjustments =
    Boolean(bwAdjustment) ||
    Boolean(bwMagentaGreen);

  const renderDataSquare = (label: string, value: string | number = '0') => (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-0.5',
      'bg-white/25 border border-white/20 rounded-md p-1',
    )}>
      <div>{typeof value === 'number' ? addSign(value) : value}</div>
      <div className={clsx(
        'text-[10px] leading-none tracking-wide font-medium text-black/50',
      )}>
        {label}
      </div>
    </div>
  );

  return <div className="flex gap-8">
    <div className={clsx(
      'w-[17rem] self-start',
      'p-3',
      'rounded-lg shadow-2xl',
      'bg-white/60 backdrop-blur-xl border border-white/30',
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
      <div className="uppercase space-y-2">
        <div className="flex gap-2 *:grow">
          <div className={clsx(
            'inline-flex justify-center',
            'bg-white/25 border border-white/20 rounded-md px-1',
          )}>
            DR{dynamicRange ?? 100}
          </div>
          <div className={clsx(
            'inline-flex justify-center',
            'bg-white/25 border border-white/20 rounded-md px-1',
          )}>
            {iso}
          </div>
          <div className={clsx(
            'inline-flex justify-center',
            'bg-white/25 border border-white/20 rounded-md px-1',
          )}>
            {exposure}
          </div>
        </div>
        <div className="flex gap-2 *:w-full">
          {renderDataSquare(
            `R${addSign(whiteBalance?.red)} / B${addSign(whiteBalance?.blue)}`,
            whiteBalanceFormatted,
          )}
        </div>
        <div className="flex gap-2 *:w-full">
          {renderDataSquare('Highlight', highlight || random.highlight)}
          {renderDataSquare('Shadow', shadow || random.shadow)}
        </div>
        <div className="flex gap-2 *:w-full">
          {/* TODO: Confirm color vs saturation label */}
          {renderDataSquare('Color', color || random.color)}
          {renderDataSquare('Sharpness', sharpness || random.sharpness)}
          {renderDataSquare('Clarity', clarity || random.clarity)}
        </div>
        <div className="flex gap-2 *:w-full">
          {renderDataSquare('Color Chrome', colorChromeEffect)}
          {renderDataSquare('FX Blue', colorChromeFXBlue)}
        </div>
        {grainEffect &&
          <div className="flex gap-2 *:w-full">
            {renderDataSquare(
              highISONoiseReduction !== undefined
                ? 'High ISO NR'
                : 'Noise Reduction',
              highISONoiseReduction ?? noiseReductionBasic,
            )}
            {renderDataSquare(
              'Grain',
              // eslint-disable-next-line max-len
              `${grainEffect.roughness} / ${grainEffect.size === 'large' ? 'LG' : grainEffect.size === 'small' ? 'SM' : 'OFF'}`,
            )}
          </div>}
        {hasBWAdjustments &&
          <div className="flex gap-2 *:w-full">
            {renderDataSquare('BW Adjustment', bwAdjustment)}
            {renderDataSquare('BW Magenta Green', bwMagentaGreen)}
          </div>}
      </div>
    </div>
  </div>;
}
