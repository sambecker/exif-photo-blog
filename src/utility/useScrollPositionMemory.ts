import { useLayoutEffect } from 'react';

const positions = new Map<string, number>();

export const getSavedScrollPosition = (pathname: string) =>
  positions.get(pathname);

export default function useScrollPositionMemory(pathname: string) {
  // Subscribing in a layout effect—rather than a passive one—binds the
  // listener to the new pathname within the same commit, before the browser
  // can dispatch a scroll event. Otherwise the router's scroll-to-top on
  // forward navigation gets recorded against the path being left, wiping
  // the position we're trying to remember
  useLayoutEffect(() => {
    let frame: number | undefined;
    // Coalesce rapid-fire scroll events (e.g., mobile flick scrolling)
    // into at most one write per animation frame
    const save = () => {
      if (frame !== undefined) { return; }
      frame = requestAnimationFrame(() => {
        frame = undefined;
        positions.set(pathname, window.scrollY);
      });
    };
    save();
    window.addEventListener('scroll', save, { passive: true });
    return () => {
      window.removeEventListener('scroll', save);
      if (frame !== undefined) { cancelAnimationFrame(frame); }
    };
  }, [pathname]);
}
