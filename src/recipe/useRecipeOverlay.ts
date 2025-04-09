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
  const [shouldShowRecipeOverlay, setShouldShowRecipeOverlay] = useState(false);

  const showRecipeOverlay =
    useCallback(() => setShouldShowRecipeOverlay(true), []);
  const hideRecipeOverlay =
    useCallback(() => setShouldShowRecipeOverlay(false), []);
  const toggleRecipeOverlay = useCallback(() =>
    setShouldShowRecipeOverlay(current => !current),
  []);

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
