import useScrollDirection, {
  setStickyChromeMax,
} from '@/utility/useScrollDirection';
import { clsx } from 'clsx/lite';
import {
  CSSProperties,
  RefObject,
  useId,
  useLayoutEffect,
  useRef,
} from 'react';
import { useStickyHeaderContext } from './StickyHeaderProvider';

// Above page content (up to z-20), below menus and modals (z-50);
// lower levels slide beneath higher ones when hiding/showing
const Z_INDEX_TOP_LEVEL = 40;

// Levels stack in document order: each sticks beneath those above it.
// Nav-tracking levels scroll away with the gesture. Persistent levels
// keep a native sticky top that moves with that same scroll delta.
// Apply container props to the element referenced by `ref`,
// and content props to a child element that masks content beneath.
export default function useStickyHeader(
  ref: RefObject<HTMLElement | null>,
  isEnabled = true,
  tracksNav = true,
) {
  const id = useId();

  const { levels, updateLevel, removeLevel } = useStickyHeaderContext();

  const { scrollDirection, scrollY, chromeHiddenPx } = useScrollDirection();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !isEnabled) { return; }
    const observer = new ResizeObserver(() =>
      updateLevel({
        id,
        element,
        height: element.offsetHeight,
        tracksNav,
      }));
    observer.observe(element);
    return () => {
      observer.disconnect();
      removeLevel(id);
    };
  }, [id, ref, isEnabled, tracksNav, updateLevel, removeLevel]);

  const index = Math.max(levels.findIndex(level => level.id === id), 0);
  const height = levels[index]?.height ?? 0;
  const levelsAbove = levels.slice(0, index);
  const offset = levelsAbove
    .reduce((total, level) => total + level.height, 0);
  const trackedHeightAbove = levelsAbove
    .reduce((total, level) => total + (level.tracksNav ? level.height : 0), 0);
  // Chrome that leads the page, before the first persistent banner
  let chromeMax = 0;
  for (const level of levels) {
    if (!level.tracksNav) { break; }
    chromeMax += level.height;
  }

  useLayoutEffect(() => {
    setStickyChromeMax(chromeMax);
  }, [chromeMax]);

  // Position in document when not stuck, measured after render
  const naturalTopRef = useRef(0);
  const naturalBottom = naturalTopRef.current + height;

  const isSticky = isEnabled && (
    scrollY > naturalBottom ||
    scrollDirection === 'up'
  );

  // Persistent banners stick as soon as they are shown, at a top that
  // follows the scroll. Tracking levels still wait until they have
  // scrolled off, then slide with the same delta.
  const isPositioned = tracksNav ? isSticky : isEnabled;
  const collapse = Math.min(chromeHiddenPx, trackedHeightAbove);
  const chromeProgress = chromeMax > 0 ? chromeHiddenPx / chromeMax : 0;
  const contentShift = tracksNav
    ? -chromeProgress * (height + offset)
    : 0;

  useLayoutEffect(() => {
    if (!isSticky && ref.current) {
      naturalTopRef.current =
        ref.current.getBoundingClientRect().top + window.scrollY;
    }
  });

  const containerStyle: CSSProperties | undefined = isPositioned
    ? {
      top: tracksNav ? offset : offset - collapse,
      zIndex: Z_INDEX_TOP_LEVEL - index,
    }
    : undefined;

  const contentStyle: CSSProperties | undefined = isPositioned && tracksNav
    ? { transform: `translateY(${contentShift}px)` }
    : undefined;

  return {
    containerClassName: clsx(isPositioned && 'sticky pointer-events-none'),
    containerStyle,
    contentClassName: undefined,
    contentStyle,
    isVisible: tracksNav ? chromeHiddenPx === 0 : true,
  };
};
