import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function useViewportHeight(
  shouldDebounce = true,
) {
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  const setViewportHeightDebounced =
    useDebouncedCallback(setViewportHeight, 100);

  useEffect(() => {
    const handleResize = () => {
      if (shouldDebounce) {
        setViewportHeightDebounced(window.visualViewport?.height ?? 0);
      } else {
        setViewportHeight(window.visualViewport?.height ?? 0);
      }
    };
    handleResize();
    window.visualViewport?.addEventListener('resize', handleResize);
    return () =>
      window.visualViewport?.removeEventListener('resize', handleResize);
  }, [shouldDebounce, setViewportHeightDebounced]);

  return viewportHeight;
}
