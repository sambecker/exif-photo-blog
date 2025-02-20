import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import clsx from 'clsx/lite';

const addSign = (value: number) => value < 0 ? value : `+${value}`;

export default function PhotoRecipe({ recipe: {
  dynamicRange,
  highlight,
  shadow,
  color,
  highISONoiseReduction,
  noiseReductionLegacy,
  sharpness,
  clarity,
  grainEffect,
  colorChromeEffect,
  colorChromeFXBlue,
  whiteBalance,
  bwAdjustment,
  bwMagentaGreen,
} }: { recipe: FujifilmRecipe }) {  
  return <div className="text-left space-y-4">
    <div className="font-bold">
      Fujifilm Recipe
    </div>
    <div className={clsx(
      'grid grid-cols-2 gap-2',
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
      {noiseReductionLegacy !== undefined && <>
        <div>NR</div>
        <div>{noiseReductionLegacy}</div>
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
