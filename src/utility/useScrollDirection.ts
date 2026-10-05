import { useSyncExternalStore } from 'react';

interface ScrollInfo {
  scrollDirection: 'up' | 'down'
  scrollY: number
}

const INITIAL_SCROLL_INFO: ScrollInfo = {
  scrollDirection: 'down',
  scrollY: 0,
};

// Shared across subscribers so that multiple sticky elements
// always respond to the exact same scroll state
let scrollInfo = INITIAL_SCROLL_INFO;
let raf: number | undefined;
const listeners = new Set<() => void>();

const handleScroll = () => {
  // Coalesce rapid-fire scroll events (e.g., mobile flick scrolling)
  // into at most one update per animation frame
  if (raf !== undefined) { return; }
  raf = requestAnimationFrame(() => {
    raf = undefined;
    const scrollY = window.scrollY;
    if (scrollY === scrollInfo.scrollY) { return; }
    const pageHeight = (
      document.documentElement.scrollHeight -
      window.innerHeight
    );
    const scrollDirection = (
      scrollY > scrollInfo.scrollY ||
      scrollInfo.scrollY > pageHeight
    ) ? 'down' : 'up';
    scrollInfo = { scrollDirection, scrollY };
    listeners.forEach(listener => listener());
  });
};

const subscribe = (listener: () => void) => {
  if (listeners.size === 0) {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('scroll', handleScroll);
      if (raf !== undefined) {
        cancelAnimationFrame(raf);
        raf = undefined;
      }
      scrollInfo = INITIAL_SCROLL_INFO;
    }
  };
};

export default function useScrollDirection() {
  return useSyncExternalStore(
    subscribe,
    () => scrollInfo,
    () => INITIAL_SCROLL_INFO,
  );
}
