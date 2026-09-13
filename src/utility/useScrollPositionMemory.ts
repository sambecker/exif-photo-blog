import { useLayoutEffect } from 'react';

const positions = new Map<string, number>();

let pendingScrollTopPath: string | null = null;

export const getSavedScrollPosition = (pathname: string) =>
  positions.get(pathname);

export const requestScrollToTop = (pathname: string) => {
  positions.set(pathname, 0);
  pendingScrollTopPath = pathname;
};

export default function useScrollPositionMemory(pathname: string) {
  // Subscribing in a layout effect—rather than a passive one—binds the
  // listener to the new pathname within the same commit, before the browser
  // can dispatch a scroll event. Otherwise the router's scroll-to-top on
  // forward navigation gets recorded against the path being left, wiping
  // the position we're trying to remember
  useLayoutEffect(() => {
    let topFrame: number | undefined;
    const shouldScrollToTop = pendingScrollTopPath === pathname;
    if (shouldScrollToTop) {
      window.scrollTo(0, 0);
      topFrame = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        pendingScrollTopPath = null;
        positions.set(pathname, 0);
      });
    }

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
    if (!shouldScrollToTop) { save(); }
    window.addEventListener('scroll', save, { passive: true });
    return () => {
      window.removeEventListener('scroll', save);
      if (frame !== undefined) { cancelAnimationFrame(frame); }
      if (topFrame !== undefined) { cancelAnimationFrame(topFrame); }
    };
  }, [pathname]);
}
