import { useEffect, useState } from 'react';

export default function useScrollDirection() {
  const [scrollInfo, setScrollInfo] = useState({
    scrollDirection: 'down' as 'up' | 'down',
    scrollY: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageHeight = (
        document.documentElement.scrollHeight -
        window.innerHeight
      );
      setScrollInfo(prev => {
        let scrollDirection = prev.scrollDirection;
        if (scrollY !== prev.scrollY) {
          scrollDirection = (
            scrollY > prev.scrollY ||
            prev.scrollY > pageHeight
          ) ? 'down' : 'up';
        }
        return {
          scrollDirection,
          scrollY,
        };
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollInfo;
}
