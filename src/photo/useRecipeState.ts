import {
  getPathComponents,
  pathForPhoto,
  SEARCH_PARAM_SHOW_RECIPE,
} from '@/app/paths';
import { usePathname } from 'next/navigation';
import { SEARCH_PARAM_SHOW } from '@/app/paths';
import { useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

export default function useRecipeState() {
  const pathname = usePathname();
  const params = useSearchParams();

  const {
    photoId,
    ...pathComponents
  } = getPathComponents(pathname);
  const showRecipeInitially =
    params.get(SEARCH_PARAM_SHOW) === SEARCH_PARAM_SHOW_RECIPE;

  const [shouldShowRecipe, setShouldShowRecipe] = useState(showRecipeInitially);

  const recipeButtonRef = useRef<HTMLButtonElement>(null);

  const toggleRecipe = useCallback(() => {
    if (shouldShowRecipe) {
      setShouldShowRecipe(false);
      // Only remove query param for photo details
      if (photoId) {
        window.history.pushState(
          null,
          '',
          pathForPhoto({
            photo: photoId,
            ...pathComponents,
          }),
        );
      }
    } else {
      setShouldShowRecipe(true);
      // Only add query param for photo details
      if (photoId) {
        window.history.pushState(
          null,
          '',
          pathForPhoto({
            photo: photoId,
            ...pathComponents,
            showRecipe: true,
          }),
        );
      }
    }
  }, [pathComponents, photoId, shouldShowRecipe]);

  return {
    toggleRecipe,
    recipeButtonRef,
    shouldShowRecipe,
  };
}
