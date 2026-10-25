import {
  CSSProperties,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

const CSS_VAR_MASK_COLOR_START = '--mask-color-start';
const CSS_VAR_MASK_COLOR_END   = '--mask-color-end';
// Subpixel layout and overflow:scroll can report a few px of overflow
// when the content still fits. Don't fade until more than this is hidden.
const MASK_OVERFLOW_TOLERANCE = 8;

export default function useMaskedScroll({
  ref: containerRef,
  direction = 'vertical',
  fadeSize = 24,
  animationDuration = 0.2,
  setMaxSize = true,
  hideScrollbar = true,
  // Disable when calling 'updateMask' explicitly
  updateMaskOnEvents = true,
  scrollToEndOnMount,
}: {
  ref: RefObject<HTMLDivElement | null>
  updateMaskOnEvents?: boolean
  direction?: 'vertical' | 'horizontal'
  fadeSize?: number
  animationDuration?: number
  setMaxSize?: boolean
  hideScrollbar?: boolean
  scrollToEndOnMount?: boolean
}) {
  const isVertical = direction === 'vertical';
  const [scrollable, setScrollable] = useState(false);

  const _updateMask = useCallback(() => {
    const ref = containerRef?.current;
    if (ref) {
      const startOverflow = isVertical ? ref.scrollTop : ref.scrollLeft;
      const endOverflow = isVertical
        ? ref.scrollHeight - ref.scrollTop - ref.clientHeight
        : ref.scrollWidth - ref.scrollLeft - ref.clientWidth;
      const start = startOverflow <= MASK_OVERFLOW_TOLERANCE;
      const end = endOverflow <= MASK_OVERFLOW_TOLERANCE;
      // Content that isn't clipped must not be a scroll container,
      // or trackpads rubber-band it.
      setScrollable(!(start && end));
      ref.style.setProperty(CSS_VAR_MASK_COLOR_START, start
        ? 'rgba(0, 0, 0, 1)'
        : 'rgba(0, 0, 0, 0)');
      ref.style.setProperty(CSS_VAR_MASK_COLOR_END, end
        ? 'rgba(0, 0, 0, 1)'
        : 'rgba(0, 0, 0, 0)');
    }
  }, [containerRef, isVertical]);

  const updateMask = useDebouncedCallback(_updateMask, 50, { leading: true });

  useLayoutEffect(() => {
    const ref = containerRef?.current;
    if (!ref) return;

    updateMask();
    if (!updateMaskOnEvents) return;

    const observer = new ResizeObserver(() => updateMask());
    observer.observe(ref);
    Array.from(ref.children).forEach(child => observer.observe(child));
    ref.addEventListener('scroll', updateMask);
    return () => {
      observer.disconnect();
      ref.removeEventListener('scroll', updateMask);
    };
  }, [containerRef, updateMask, updateMaskOnEvents]);

  useEffect(() => {
    const ref = containerRef?.current;
    const contentRect = ref?.children[0]?.getBoundingClientRect();
    if (scrollToEndOnMount && ref && contentRect) {
      ref.scrollTo(isVertical
        ? { top: contentRect.height }
        : { left: contentRect.width });
    }
  }, [containerRef, scrollToEndOnMount, isVertical]);

  useEffect(() => {
    try {
      window.CSS.registerProperty({
        name: CSS_VAR_MASK_COLOR_START,
        syntax: '<color>',
        initialValue: 'rgba(0, 0, 0, 1)',
        inherits: false,
      });
      window.CSS.registerProperty({
        name: CSS_VAR_MASK_COLOR_END,
        syntax: '<color>',
        initialValue: 'rgba(0, 0, 0, 1)',
        inherits: false,
      });
    } catch {}
  }, []);

  const styleMask: CSSProperties = useMemo(() => {
    const gradient = (
      direction: 'bottom' | 'top' | 'right' | 'left',
      color: string,
    ) => {
      const midStop = Math.round(fadeSize * 0.42);
      return [
        `linear-gradient(to ${direction}`,
        `var(${color}) 0px`,
        // Stay mostly visible, then ease out toward the edge
        `color-mix(in srgb, var(${color}) 28%, black) ${midStop}px`,
        `black ${fadeSize}px)`,
      ].join(', ');
    };
    const gradientStart = gradient(
      isVertical ? 'bottom' : 'right',
      CSS_VAR_MASK_COLOR_START,
    );
    const gradientEnd = gradient(
      isVertical ? 'top' : 'left',
      CSS_VAR_MASK_COLOR_END,
    );
    const maskImage = [gradientStart, gradientEnd].join(', ');
    const transition = [
      `${CSS_VAR_MASK_COLOR_START} ${animationDuration}s ease-in-out`,
      `${CSS_VAR_MASK_COLOR_END} ${animationDuration}s ease-in-out`,
    ].join(', ');
    return {
      maskImage,
      maskComposite: 'intersect',
      maskRepeat: 'no-repeat',
      transition,
      ...hideScrollbar && { scrollbarWidth: 'none' },
      ...isVertical
        ? {
          ...setMaxSize && { maxHeight: '100%' },
          overflowX: 'hidden',
          overflowY: scrollable ? 'auto' : 'hidden',
        } : {
          ...setMaxSize && { maxWidth: '100%' },
          overflowX: scrollable ? 'auto' : 'hidden',
          overflowY: 'hidden',
        },
    };
  }, [
    isVertical,
    fadeSize,
    animationDuration,
    hideScrollbar,
    setMaxSize,
    scrollable,
  ]);

  return { styleMask, updateMask };
}
