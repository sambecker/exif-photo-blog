import { useEffect, useState } from 'react';

export default function useScrollDirection() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    const handleScroll = () => {
      setScrollDirection(window.scrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return {
    scrollDirection,
    lastScrollY,
  };
}
