import { useLayoutEffect, useState } from 'react';

export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(min-width: var(--breakpoint-md))');
      setIsDesktop(mql.matches);
      const eventHandler = (event: MediaQueryListEvent) => {
        setIsDesktop(event.matches);
      };
      mql.addEventListener('change', eventHandler);
      return () => mql.removeEventListener('change', eventHandler);
    }
  }, []);

  return isDesktop;
};
