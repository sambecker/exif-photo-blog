import { useEffect, useState, useRef } from 'react';

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] =
    useState<'up' | 'down'>('down');

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollDirection(window.scrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    scrollDirection,
    lastScrollY: lastScrollY.current,
  };
}
