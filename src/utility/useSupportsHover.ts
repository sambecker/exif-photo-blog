import { useState, useEffect, useRef } from 'react';

export default function useSupportsHover() {
  const mqlRef = useRef(typeof window !== 'undefined'
    ? window.matchMedia('(hover: hover)')
    : undefined);
  
  const [supportsHover, setSupportsHover] = 
    useState<boolean>(mqlRef.current?.matches ?? false);

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) => setSupportsHover(e.matches);
    const mql = mqlRef.current;
    mql?.addEventListener('change', listener);
    return () => mql?.removeEventListener('change', listener);
  }, []);

  return supportsHover;
};
