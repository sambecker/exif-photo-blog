import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import clsx from 'clsx/lite';

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

export default function PhotoRecipeFrostLight({
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
}: {
  recipe: FujifilmRecipe
  simulation: FilmSimulation
}) {
  const whiteBalanceFormatted = (whiteBalance?.type ?? 'auto')
    .replaceAll('auto', ' ')
    .replaceAll('-', ' ');

  const hasCustomizedWhiteBalance =
    Boolean(whiteBalance?.red) ||
    Boolean(whiteBalance?.blue);

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
      'text-[13px] text-main',
      'saturate-200',
    )}>
      <div className="flex items-center gap-2">
        <PhotoFilmSimulation
          contrast="high"
          className="grow"
          simulation={simulation}
        />
        <div className="bg-white/60 rounded-md px-1">
          <span>DR</span>
          <span>{dynamicRange ?? 100}</span>
        </div>
      </div>
      <div
        className="uppercase space-y-2"
      >
        <div>
          {whiteBalanceFormatted.length <= 8 && 'AWB: '}
          {whiteBalanceFormatted}
          {hasCustomizedWhiteBalance && <>
            {' '}
            <span className="text-extra-dim">{'('}</span>
            R {addSign(whiteBalance?.red ?? 0)}
            <span className="text-extra-dim">/</span>
            B {addSign(whiteBalance?.blue ?? 0)}
            <span className="text-extra-dim">{')'}</span>
          </>}
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
        <div>
          {highISONoiseReduction !== undefined
            ? <>
              <span className="inline-flex min-w-[130px]">High ISO NR: </span>
              <span>{addSign(highISONoiseReduction)}</span>
            </>
            : <>
              <span>Noise Reduction: </span>
              <span>{noiseReductionBasic}</span>
            </>
          }
        </div>
        {grainEffect &&
          <div>
            <span className="inline-flex min-w-[130px]">Grain:</span>
            {grainEffect.roughness}
            <span className="text-extra-dim">{' / '}</span>
            {grainEffect.size}
          </div>}
        {hasBWAdjustments &&
          <div>
            <span className="inline-flex min-w-[130px]">BW Adjustment: </span>
            {addSign(bwAdjustment)}
            <span className="text-extra-dim">{' / '}</span>
            MG: {addSign(bwMagentaGreen)}
          </div>}
      </div>
    </div>
  </div>;
}
