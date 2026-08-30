import { useEffect } from 'react';

const positions = new Map<string, number>();

export const getSavedScrollPosition = (pathname: string) =>
  positions.get(pathname);

export default function useScrollPositionMemory(pathname: string) {
  useEffect(() => {
    const save = () => {
      positions.set(pathname, window.scrollY);
    };
    save();
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [pathname]);
}
