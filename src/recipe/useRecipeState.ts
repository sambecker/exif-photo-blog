import {
  getPathComponents,
  pathForPhoto,
  SEARCH_PARAM_SHOW_RECIPE,
} from '@/app/paths';
import { usePathname } from 'next/navigation';
import { SEARCH_PARAM_SHOW } from '@/app/paths';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { isElementEntirelyInViewport } from '@/utility/dom';
import useClickInsideOutside from '@/utility/useClickInsideOutside';

export default function useRecipeState({
  ref,
  refTrigger,
}: {
  ref?: RefObject<HTMLElement | null>,
  refTrigger?: RefObject<HTMLElement | null>,
}) {
  const pathname = usePathname();

  const {
    photoId,
    ...pathComponents
  } = getPathComponents(pathname);

  const searchParamShow = typeof document !== 'undefined'
    ? (new URLSearchParams(document.location.search)).get(SEARCH_PARAM_SHOW)
    : undefined;

  const showRecipeInitially = searchParamShow === SEARCH_PARAM_SHOW_RECIPE;

  const [shouldShowRecipe, setShouldShowRecipe] = useState(showRecipeInitially);

  const setVisibility = useCallback((shouldShow: boolean) => {
    if (shouldShow) {
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
    } else {
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
    }
  }, [pathComponents, photoId]);

  const showRecipe = useCallback(() => setVisibility(true), [setVisibility]);
  const hideRecipe = useCallback(() => setVisibility(false), [setVisibility]);
  const toggleRecipe = useCallback(() =>
    setVisibility(!shouldShowRecipe),
  [setVisibility, shouldShowRecipe]);

  useClickInsideOutside({
    htmlElements: [ref, refTrigger],
    onClickOutside: hideRecipe,
  });

  useEffect(() => {
    if (shouldShowRecipe && !isElementEntirelyInViewport(ref?.current)) {
      ref?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref, shouldShowRecipe]);

  return {
    shouldShowRecipe,
    showRecipe,
    hideRecipe,
    toggleRecipe,
  };
}
