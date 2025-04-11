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
  const [isShowingRecipeOverlay, setIsShowingRecipeOverlay] = useState(false);

  const showRecipeOverlay =
    useCallback(() => setIsShowingRecipeOverlay(true), []);
  const hideRecipeOverlay =
    useCallback(() => setIsShowingRecipeOverlay(false), []);
  const toggleRecipeOverlay = useCallback(() =>
    setIsShowingRecipeOverlay(current => !current),
  []);

  useClickInsideOutside({
    htmlElements: [ref, ...refTriggers],
    onClickOutside: hideRecipeOverlay,
  });

  useEffect(() => {
    if (isShowingRecipeOverlay && !isElementEntirelyInViewport(ref?.current)) {
      ref?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref, isShowingRecipeOverlay]);

  return {
    isShowingRecipeOverlay,
    showRecipeOverlay,
    hideRecipeOverlay,
    toggleRecipeOverlay,
  };
}
