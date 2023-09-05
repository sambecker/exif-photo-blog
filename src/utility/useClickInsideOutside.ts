import { useCallback, useEffect } from 'react';

const MOUSE_DOWN = 'mousedown';

interface Options {
  // HTML reference
  htmlElements: (HTMLElement | null)[],
  // Callbacks based on click target
  onClick?: (event?: MouseEvent) => void,
  onClickInside?: (event?: MouseEvent) => void,
  onClickOutside?: (event?: MouseEvent) => void,
  // Dynamically listen to click events
  shouldListenToClicks?: boolean,
}

const useClickInsideOutside = ({
  htmlElements,
  onClick,
  onClickInside,
  onClickOutside,
  shouldListenToClicks = true,
}: Options) => {
  const handleClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const htmlElementsContainTarget = htmlElements
      .some(element => element?.contains(target));

    // On click
    onClick?.(event);
    // On click inside
    if (htmlElementsContainTarget) {
      onClickInside?.(event);
    }
    // On click outside
    if (!htmlElementsContainTarget) {
      onClickOutside?.(event);
    }
  }, [onClick, onClickInside, onClickOutside, htmlElements]);

  useEffect(() => {
    if (shouldListenToClicks) {
      document.addEventListener(MOUSE_DOWN, handleClick);
      return () => { document.removeEventListener(MOUSE_DOWN, handleClick); };
    }
  }, [htmlElements, shouldListenToClicks, handleClick]);
};

export default useClickInsideOutside;
