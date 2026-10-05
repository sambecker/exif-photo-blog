import useScrollDirection from '@/utility/useScrollDirection';
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
// Nav-tracking levels hide/show together based on scroll direction.
// Persistent levels stay visible, shifting up when levels above hide.
// Apply container props to the element referenced by `ref`,
// and content props to a child element that masks content beneath.
export default function useStickyHeader(
  ref: RefObject<HTMLElement | null>,
  isEnabled = true,
  tracksNav = true,
) {
  const id = useId();

  const { levels, updateLevel, removeLevel } = useStickyHeaderContext();

  const { scrollDirection, scrollY } = useScrollDirection();

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
  // Position in document when not stuck, measured after render
  const naturalTopRef = useRef(0);
  const naturalBottom = naturalTopRef.current + height;

  const isSticky = isEnabled && (
    scrollY > naturalBottom ||
    scrollDirection === 'up'
  );

  const isHidden =
    isSticky &&
    scrollDirection === 'down';

  const shouldAnimate =
    isSticky && (
      scrollY > naturalBottom + height ||
      scrollDirection === 'up'
    );

  // Persistent banners stick as soon as they are shown, and move up
  // into the space of tracking levels above them when those hide.
  // Near the top of the page, tracking levels scroll away naturally,
  // so follow the scroll instead of animating.
  const isPositioned = tracksNav ? isSticky : isEnabled;
  const collapse = scrollDirection === 'down'
    ? Math.min(scrollY, trackedHeightAbove)
    : 0;
  const shouldAnimateCollapse = scrollY > trackedHeightAbove;

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
    ? { transform: `translateY(${isHidden ? -(height + offset) : 0}px)` }
    : undefined;

  return {
    containerClassName: clsx(
      isPositioned && 'sticky pointer-events-none',
      isPositioned && !tracksNav && shouldAnimateCollapse &&
        'transition-[top] duration-200',
    ),
    containerStyle,
    contentClassName: clsx(
      tracksNav && shouldAnimate && 'transition-transform duration-200',
    ),
    contentStyle,
    isVisible: tracksNav ? !isHidden : true,
  };
};
