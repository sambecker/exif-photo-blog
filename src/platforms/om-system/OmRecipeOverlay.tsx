'use client';

import { RefObject, useEffect } from 'react';
import Link from 'next/link';
import { pathForRecipe } from '@/app/path';
import { labelForOmRecipeTitle, OmRecipe } from './recipe';
import OmRecipeSettings from './OmRecipeSettings';
import RecipeOverlay, { RecipeOverlayTitle } from '@/recipe/RecipeOverlay';

export default function OmRecipeOverlay({
  ref,
  recipe,
  recipeKey,
  onClose,
  isOnPhoto = true,
}: {
  ref?: RefObject<HTMLDivElement | null>
  recipe: OmRecipe
  recipeKey: string
  onClose: () => void
  isOnPhoto?: boolean
}) {
  useEffect(() => {
    if (!isOnPhoto) { return; }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [isOnPhoto, onClose]);

  return (
    <RecipeOverlay
      ref={ref}
      onClose={onClose}
      isOnPhoto={isOnPhoto}
      isDialog={isOnPhoto}
      className="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      title={<RecipeOverlayTitle>
        <Link
          href={pathForRecipe(recipeKey)}
          onClick={onClose}
          className="hover:opacity-50 active:opacity-75"
        >
          {labelForOmRecipeTitle(recipeKey)}
        </Link>
      </RecipeOverlayTitle>}
    >
      <OmRecipeSettings recipe={recipe} />
    </RecipeOverlay>
  );
}
