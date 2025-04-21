import { RefObject, useCallback, useMemo, useState } from 'react';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import useScrollIntoView from '@/utility/useScrollIntoView';

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

  const htmlElements = useMemo(() =>
    [ref, ...refTriggers], [ref, refTriggers]);

  useClickInsideOutside({
    htmlElements,
    onClickOutside: hideRecipeOverlay,
  });

  useScrollIntoView({
    ref,
    shouldScrollIntoView: isShowingRecipeOverlay,
  });

  return {
    isShowingRecipeOverlay,
    showRecipeOverlay,
    hideRecipeOverlay,
    toggleRecipeOverlay,
  };
}
