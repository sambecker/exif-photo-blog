import useScrollInfo from '@/utility/useScrollInfo';
import { clsx } from 'clsx/lite';
import {
  CSSProperties,
  RefObject,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useStickyHeaderContext } from './StickyHeaderProvider';

// Above page content (up to z-20), below menus and modals (z-50);
// lower levels slide beneath higher ones when hiding/showing
const Z_INDEX_TOP_LEVEL = 40;

// Levels stack in document order: each sticks beneath those above it.
// Nav-tracking levels hide/show together based on scroll direction.
// Persistent levels stay visible, shifting up when levels above hide.
// Apply container props to the element referenced by `ref`,
// and content props to the child that masks content beneath.
// The container is pointer-events-none so a header that has slid
// away does not leave a stationary hit target. The moving child
// opts back in; don't re-enable pointer events on a wrapper that
// stays put (it will cover sticky banners underneath).
export default function useStickyHeader(
  ref: RefObject<HTMLElement | null>,
  isEnabled = true,
  tracksNav = true,
) {
  const id = useId();

  const { levels, updateLevel, removeLevel } = useStickyHeaderContext();

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

  // Select only the thresholds each level type depends on,
  // so scrolling doesn't re-render on every frame
  const scrollDirection = useScrollInfo(info => info.scrollDirection);
  const isPastNaturalBottom = useScrollInfo(({ scrollY }) =>
    tracksNav &&
    scrollY > naturalTopRef.current + height);
  const isPastNaturalBottomByHeight = useScrollInfo(({ scrollY }) =>
    tracksNav &&
    scrollY > naturalTopRef.current + height * 2);
  const isScrolled = useScrollInfo(({ scrollY }) =>
    !tracksNav &&
    scrollY > 0);
  // Persistent banners move up into the space of tracking levels
  // above them when those hide. Near the top of the page, tracking
  // levels scroll away naturally, so follow the scroll there.
  // Ignore negative scroll from Safari rubber-banding at the top.
  const collapse = useScrollInfo(({ scrollDirection, scrollY }) =>
    !tracksNav && scrollDirection === 'down'
      ? Math.min(Math.max(scrollY, 0), trackedHeightAbove)
      : 0);
  const shouldAnimateCollapse = useScrollInfo(({ scrollY }) =>
    !tracksNav &&
    scrollY > trackedHeightAbove);

  const isSticky = isEnabled && (
    isPastNaturalBottom ||
    scrollDirection === 'up'
  );

  const isHidden =
    isSticky &&
    scrollDirection === 'down';

  const shouldAnimate =
    isSticky && (
      isPastNaturalBottomByHeight ||
      scrollDirection === 'up'
    );

  // Persistent banners stick as soon as they are shown
  const isPositioned = tracksNav ? isSticky : isEnabled;

  useLayoutEffect(() => {
    if (tracksNav && !isSticky && ref.current) {
      naturalTopRef.current =
        ref.current.getBoundingClientRect().top + window.scrollY;
    }
  });

  // Persistent banners are always sticky, so detect whether they're
  // pinned at their sticky top rather than resting in document flow,
  // without measuring layout while scrolling
  const [isAtStickyTop, setIsAtStickyTop] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (tracksNav || !isEnabled || !element) { return; }
    const observer = new IntersectionObserver(
      ([entry]) => setIsAtStickyTop(
        entry.boundingClientRect.top <= offset + 0.5,
      ),
      { rootMargin: `-${offset + 1}px 0px 0px 0px`, threshold: 1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, tracksNav, isEnabled, offset]);

  const isOutOfPosition = isScrolled && isAtStickyTop;

  const containerStyle: CSSProperties | undefined = isPositioned
    ? {
      top: offset,
      zIndex: Z_INDEX_TOP_LEVEL - index,
    }
    : undefined;

  // Shift content with transforms rather than animating sticky `top`,
  // which Safari can't composite and repositions a frame behind scroll
  const contentStyle: CSSProperties | undefined = isPositioned
    ? tracksNav
      ? {
        transform: `translateY(${isHidden ? -(height + offset) : 0}px)`,
        // No hit target once the layer has slid away
        ...isHidden && { pointerEvents: 'none' },
      }
      : { transform: `translateY(${-collapse}px)` }
    : undefined;

  return {
    containerClassName: clsx(isPositioned && 'sticky pointer-events-none'),
    containerStyle,
    contentClassName: clsx(
      'pointer-events-auto',
      (tracksNav ? shouldAnimate : shouldAnimateCollapse) &&
        'transition-transform duration-200',
    ),
    contentStyle,
    isVisible: tracksNav ? !isHidden : true,
    isOutOfPosition,
  };
};
