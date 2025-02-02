import { useState, useEffect } from 'react';

export default function useSupportsHover() {
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover)');
    setSupportsHover(mql.matches);

    const listener = (e: MediaQueryListEvent) => {
      setSupportsHover(e.matches);
    };

    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return supportsHover;
};
