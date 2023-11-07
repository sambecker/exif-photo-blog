import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config';
import { useLayoutEffect, useState } from 'react';

const screens = resolveConfig(tailwindConfig).theme?.screens as any;

export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(min-width: ${screens.md})`);
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
