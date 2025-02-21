import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import clsx from 'clsx/lite';

const addSign = (value = 0) => value < 0 ? value : `+${value}`;

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
      'flex flex-col items-center justify-center',
      'bg-dim border-medium rounded-md p-0.5',
    )}>
      <div>{typeof value === 'number' ? addSign(value) : value}</div>
      <div className="text-xs tracking-wide text-dim">
        {label}
      </div>
    </div>
  );

  return <div className="flex gap-8">
    <div className={clsx(
      'w-[20rem] self-start',
      'p-3',
      'component-surface shadow-xs',
      'space-y-3',
    )}>
      <div className="flex items-center gap-2">
        <PhotoFilmSimulation {...{ simulation, className: 'grow' }} />
        <div className="bg-dim border-medium rounded-md px-1">
          <span>DR</span>
          <span>{dynamicRange ?? 100}</span>
        </div>
      </div>
      <div
        className="uppercase space-y-3"
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
        <div className="flex gap-3 *:w-full">
          {renderDataSquare('Highlight', highlight)}
          {renderDataSquare('Shadow', shadow)}
        </div>
        <div className="flex gap-3 *:w-full">
          {/* TODO: Confirm color vs saturation label */}
          {renderDataSquare('Color', color)}
          {renderDataSquare('Sharp', sharpness)}
          {renderDataSquare('Clarity', clarity)}
        </div>
        <div className="flex gap-3 *:w-full">
          {renderDataSquare('Chrome', colorChromeEffect)}
          {renderDataSquare('FX Blue', colorChromeFXBlue)}
        </div>
        <div>
          {highISONoiseReduction !== undefined
            ? <>
              <span>High ISO NR: </span>
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
            Grain:
            {' '}
            {grainEffect.roughness}
            <span className="text-extra-dim">{' / '}</span>
            {grainEffect.size}
          </div>}
        {hasBWAdjustments &&
          <div>
            BW Adjustment: {addSign(bwAdjustment)}
            <span className="text-extra-dim">{' / '}</span>
            MG: {addSign(bwMagentaGreen)}
          </div>}
      </div>
    </div>
  </div>;
}
