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
      'bg-dim rounded-md p-0.5',
    )}>
      <div>{typeof value === 'number' ? addSign(value) : value}</div>
      <div>{label}</div>
    </div>
  );

  return <div className="flex gap-8">
    <div className={clsx(
      'w-[18rem] self-start',
      'p-3',
      'component-surface shadow-xs',
      'space-y-3',
    )}>
      <div className="flex items-center gap-2">
        <PhotoFilmSimulation {...{ simulation, className: 'grow' }} />
        <div className="bg-dim rounded-md p-0.5">
          <span>DR</span>
          <span>{dynamicRange ?? 100}</span>
        </div>
      </div>
      <div
        className="text-sm uppercase space-y-3"
      >
        <div>
          {whiteBalanceFormatted.length <= 8 && 'AWB: '}
          {whiteBalanceFormatted}
          {hasCustomizedWhiteBalance && <>
            {' '}
            <span className="text-extra-dim">{'('}</span>
            R{addSign(whiteBalance?.red ?? 0)}
            <span className="text-extra-extra-dim"> / </span>
            B{addSign(whiteBalance?.blue ?? 0)}
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
            BW Adjustment:
            {' '}
            {addSign(bwAdjustment)}
            {' '}
            MG:
            {addSign(bwMagentaGreen)}
          </div>}
      </div>
    </div>
    <div className={clsx(
      'px-3 py-2 max-w-[16rem]',
      'text-left text-xs',
      'border-medium rounded-md',
      'grid grid-cols-2 gap-1',
      '*:odd:text-dim *:even:uppercase',
    )}>
      {dynamicRange !== undefined && <>
        <div>DR</div>
        <div>{dynamicRange}</div>
      </>}
      {highlight !== undefined && <>
        <div>Highlight</div>
        <div>{addSign(highlight)}</div>
      </>}
      {shadow !== undefined && <>
        <div>Shadow</div>
        <div>{addSign(shadow)}</div>
      </>}
      {color !== undefined && <>
        <div>Color</div>
        <div>{addSign(color)}</div>
      </>}
      {highISONoiseReduction !== undefined && <>
        <div>High ISO NR</div>
        <div>{addSign(highISONoiseReduction)}</div>
      </>}
      {noiseReductionBasic !== undefined && <>
        <div>NR</div>
        <div>{noiseReductionBasic}</div>
      </>}
      {sharpness !== undefined && <>
        <div>Sharpness</div>
        <div>{addSign(sharpness)}</div>
      </>}
      {clarity !== undefined && <>
        <div>Clarity</div>
        <div>{addSign(clarity)}</div>
      </>}
      {grainEffect !== undefined && <>
        <div>Grain</div>
        <div>{grainEffect.roughness} / {grainEffect.size}</div>
      </>}
      {colorChromeEffect !== undefined && <>
        <div>Chrome</div>
        <div>{colorChromeEffect}</div>
      </>}
      {colorChromeFXBlue !== undefined && <>
        <div>Chrome FX Blue</div>
        <div>{colorChromeFXBlue}</div>
      </>}
      {whiteBalance !== undefined && <>
        <div>White Balance</div>
        <div>
          <div>{whiteBalance.type}</div>
          <div>
            {addSign(whiteBalance.red)} / {addSign(whiteBalance.blue)}
          </div>
        </div>
      </>}
      {bwAdjustment !== undefined && <>
        <div>BW</div>
        <div>{addSign(bwAdjustment)}</div>
      </>}
      {bwMagentaGreen !== undefined && <>
        <div>BW MG</div>
        <div>{addSign(bwMagentaGreen)}</div>
      </>}
    </div>
  </div>;
}
