import { useState, useEffect, useRef } from 'react';

export default function useSupportsHover() {
  const mqlRef = useRef(typeof window !== 'undefined'
    ? window.matchMedia('(hover: hover)')
    : undefined);
  
  const [supportsHover, setSupportsHover] = useState<boolean>(false);

  useEffect(() => {
    const mql = mqlRef.current;
    if (mql) {
      setSupportsHover(mql.matches);
      const listener = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
      mql.addEventListener('change', listener);
      return () => mql?.removeEventListener('change', listener);
    }
  }, []);

  return supportsHover;
};
