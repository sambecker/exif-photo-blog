'use client';

import PhotoFilm from '@/film/PhotoFilm';
import clsx from 'clsx/lite';
import { RefObject } from 'react';
import {
  addSign,
  formatGrain,
  formatNoiseReduction,
  formatRecipe,
  formatWhiteBalance,
  generateRecipeText,
  RecipeProps,
} from '.';
import CopyButton from '@/components/CopyButton';
import PhotoRecipe from './PhotoRecipe';
import { useAppText } from '@/i18n/state/client';
import RecipeOverlay, { RecipeOverlayTitle } from './RecipeOverlay';
import RecipeGrid, { RecipeGridCell } from './RecipeGrid';

export default function PhotoRecipeOverlay({
  ref,
  title,
  data,
  film,
  make,
  onClose,
  isOnPhoto = true,
}: RecipeProps & {
  ref?: RefObject<HTMLDivElement | null>
  onClose?: () => void
  isOnPhoto?: boolean
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

  const appText = useAppText();

  return (
    <RecipeOverlay
      ref={ref}
      onClose={onClose}
      isOnPhoto={isOnPhoto}
      title={title
        ? <div className="hover:opacity-50 active:opacity-75">
          <PhotoRecipe
            recipe={title}
            contrast="frosted"
            className={clsx(
              'text-[15px]',
              '[&>*>*>*>*]:text-black',
              'tracking-wide',
            )}
          />
        </div>
        : <RecipeOverlayTitle>Recipe</RecipeOverlayTitle>}
      actions={<CopyButton
        label={`${title
          ? `${formatRecipe(title).toLocaleUpperCase()} recipe`
          : 'Recipe'}`}
        text={generateRecipeText({ title, data, film })}
        iconSize={17}
        className={clsx(
          'translate-y-[-1.5px]',
          'text-black/40 active:text-black/75',
          'hover:text-black/40',
        )}
        tooltip={appText.tooltip.recipeCopy}
        tooltipColor="frosted-light"
      />}
    >
      <RecipeGrid>
        {/* ROW */}
        <RecipeGridCell span={8}>
          <div className="flex items-center gap-1.5">
            <PhotoFilm
              film={film}
              make={isOnPhoto ? make : undefined}
              contrast="frosted"
              className={clsx(
                'translate-y-[-0.5px]',
                '*:text-black! *:active:text-black!',
                'opacity-80 hover:opacity-60 active:opacity-80',
              )}
              badged={false}
            />
          </div>
        </RecipeGridCell>
        <RecipeGridCell>
          {`DR${dynamicRange.development}`}
        </RecipeGridCell>
        {/* ROW */}
        <RecipeGridCell
          span={8}
          label={
            `R${addSign(whiteBalance?.red)} / B${addSign(whiteBalance?.blue)}`}
        >
          {formatWhiteBalance(data).toUpperCase()}
        </RecipeGridCell>
        <RecipeGridCell label="ISO NR">
          {formatNoiseReduction(data)}
        </RecipeGridCell>
        {/* ROW */}
        <RecipeGridCell span={6} label="Highlight">
          {addSign(highlight)}
        </RecipeGridCell>
        <RecipeGridCell span={6} label="Shadow">
          {addSign(shadow)}
        </RecipeGridCell>
        {/* ROW */}
        <RecipeGridCell label="Color">{addSign(color)}</RecipeGridCell>
        <RecipeGridCell label="Sharpness">{addSign(sharpness)}</RecipeGridCell>
        <RecipeGridCell label="Clarity">{addSign(clarity)}</RecipeGridCell>
        {/* ROW */}
        <RecipeGridCell span={6} label="Color Chrome">
          {colorChromeEffect?.toLocaleUpperCase() ?? 'N/A'}
        </RecipeGridCell>
        <RecipeGridCell span={6} label="FX Blue">
          {colorChromeFXBlue?.toLocaleUpperCase() ?? 'N/A'}
        </RecipeGridCell>
        {/* ROW */}
        <RecipeGridCell span={6} label="grain">
          {formatGrain(data)}
        </RecipeGridCell>
        <RecipeGridCell span={3} label="BW ADJ">
          {addSign(bwAdjustment ?? 0)}
        </RecipeGridCell>
        <RecipeGridCell span={3} label="BW M/G">
          {addSign(bwMagentaGreen ?? 0)}
        </RecipeGridCell>
      </RecipeGrid>
    </RecipeOverlay>
  );
}
