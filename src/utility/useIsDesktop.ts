import { useEffect, useState } from 'react';

export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const breakpointMd = getComputedStyle(document.body)
        .getPropertyValue('--breakpoint-md');
      const mql = window.matchMedia(`(min-width: ${breakpointMd})`);
      setIsDesktop(mql.matches);

      const eventHandler = (event: MediaQueryListEvent) =>
        setIsDesktop(event.matches);

      mql.addEventListener('change', eventHandler);
      return () => mql.removeEventListener('change', eventHandler);
    }
  }, []);

  return isDesktop;
};
