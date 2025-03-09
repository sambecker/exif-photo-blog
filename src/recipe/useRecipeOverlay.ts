import {
  getPathComponents,
  pathForPhoto,
} from '@/app/paths';
import { usePathname } from 'next/navigation';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { isElementEntirelyInViewport } from '@/utility/dom';
import useClickInsideOutside from '@/utility/useClickInsideOutside';

export default function useRecipeOverlay({
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

  const [shouldShowRecipeOverlay, setShouldShowRecipeOverlay] = useState(false);

  const setVisibility = useCallback((shouldShow: boolean) => {
    if (shouldShow) {
      setShouldShowRecipeOverlay(true);
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
      setShouldShowRecipeOverlay(false);
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

  const showRecipeOverlay =
    useCallback(() => setVisibility(true), [setVisibility]);
  const hideRecipeOverlay =
    useCallback(() => setVisibility(false), [setVisibility]);
  const toggleRecipeOverlay = useCallback(() =>
    setVisibility(!shouldShowRecipeOverlay),
  [setVisibility, shouldShowRecipeOverlay]);

  useClickInsideOutside({
    htmlElements: [ref, ...refTriggers],
    onClickOutside: hideRecipeOverlay,
  });

  useEffect(() => {
    if (shouldShowRecipeOverlay && !isElementEntirelyInViewport(ref?.current)) {
      ref?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref, shouldShowRecipeOverlay]);

  return {
    shouldShowRecipeOverlay,
    showRecipeOverlay,
    hideRecipeOverlay,
    toggleRecipeOverlay,
  };
}
