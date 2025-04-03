import { useEffect, useState } from 'react';

export default function useScrollDirection() {
  const [scrollInfo, setScrollInfo] = useState({
    scrollDirection: 'down' as 'up' | 'down',
    scrollY: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight = (
        document.documentElement.scrollHeight -
        window.innerHeight
      );
      setScrollInfo(prev => ({
        scrollDirection: (
          window.scrollY >= prev.scrollY ||
          prev.scrollY > pageHeight
        ) ? 'down' : 'up',
        scrollY: window.scrollY,
      }));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollInfo;
}
