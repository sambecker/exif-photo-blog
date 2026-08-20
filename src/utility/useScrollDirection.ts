import { useEffect, useRef, useState } from 'react';

export default function useScrollDirection() {
  const [scrollInfo, setScrollInfo] = useState({
    scrollDirection: 'down' as 'up' | 'down',
    scrollY: 0,
  });

  const isTickingRef = useRef(false);
  const rafRef = useRef<number>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      // Coalesce rapid-fire scroll events (e.g., mobile flick scrolling)
      // into at most one state update per animation frame
      if (isTickingRef.current) { return; }
      isTickingRef.current = true;
      rafRef.current = requestAnimationFrame(() => {
        isTickingRef.current = false;
        const scrollY = window.scrollY;
        const pageHeight = (
          document.documentElement.scrollHeight -
          window.innerHeight
        );
        setScrollInfo(prev => {
          if (scrollY === prev.scrollY) { return prev; }
          const scrollDirection = (
            scrollY > prev.scrollY ||
            prev.scrollY > pageHeight
          ) ? 'down' : 'up';
          return {
            scrollDirection,
            scrollY,
          };
        });
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return scrollInfo;
}
