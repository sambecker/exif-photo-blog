import {
  getPathComponents,
  pathForPhoto,
} from '@/app/paths';
import { usePathname } from 'next/navigation';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { isElementEntirelyInViewport } from '@/utility/dom';
import useClickInsideOutside from '@/utility/useClickInsideOutside';

export default function useRecipeState({
  ref,
  refTriggers = [],
}: {
  ref?: RefObject<HTMLElement | null>,
  refTriggers?: RefObject<HTMLElement | null>[],
}) {
  const pathname = usePathname();

  const {
    photoId,
    ...pathComponents
  } = getPathComponents(pathname);

  const [shouldShowRecipe, setShouldShowRecipe] = useState(false);

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
    htmlElements: [ref, ...refTriggers],
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
