import { useEffect, useState } from 'react';

export default function useScrollDirection() {
  const [scrollInfo, setScrollInfo] = useState({
    scrollDirection: 'down' as 'up' | 'down',
    lastScrollY: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollInfo(prev => ({
        scrollDirection: window.scrollY > prev.lastScrollY ? 'down' : 'up',
        lastScrollY: window.scrollY,
      }));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollInfo;
}
