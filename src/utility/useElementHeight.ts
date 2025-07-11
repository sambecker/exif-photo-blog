import { useState, RefObject, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function useElementHeight(
  ref: RefObject<HTMLElement | null>,
  shouldDebounce = true,
) {
  const [height, setHeight] = useState(ref.current?.clientHeight);

  const setHeightDebounced =
    useDebouncedCallback(setHeight, 250, { leading: true });

  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver(e => {
        if (shouldDebounce) {
          setHeightDebounced(e[0].contentRect.height);
        } else {
          setHeight(e[0].contentRect.height);
        }
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref, setHeightDebounced, shouldDebounce]);

  return height;
}
