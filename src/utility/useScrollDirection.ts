import { useSyncExternalStore } from 'react';

interface ScrollInfo {
  scrollDirection: 'up' | 'down'
  scrollY: number
  // How far nav chrome has scrolled away, in px. Follows the scroll
  // delta so headers slide with the gesture instead of tweening.
  chromeHiddenPx: number
}

const INITIAL_SCROLL_INFO: ScrollInfo = {
  scrollDirection: 'down',
  scrollY: 0,
  chromeHiddenPx: 0,
};

// Shared across subscribers so that multiple sticky elements
// always respond to the exact same scroll state
let scrollInfo = INITIAL_SCROLL_INFO;
let chromeMaxPx = 0;
let raf: number | undefined;
const listeners = new Set<() => void>();

export const setStickyChromeMax = (max: number) => {
  chromeMaxPx = Math.max(0, max);
  if (scrollInfo.chromeHiddenPx <= chromeMaxPx) { return; }
  scrollInfo = { ...scrollInfo, chromeHiddenPx: chromeMaxPx };
  listeners.forEach(listener => listener());
};

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
    const chromeHiddenPx = Math.min(
      chromeMaxPx,
      scrollY,
      Math.max(0, scrollInfo.chromeHiddenPx + scrollY - scrollInfo.scrollY),
    );
    scrollInfo = { scrollDirection, scrollY, chromeHiddenPx };
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
