import {
  CSSProperties,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

const CSS_VAR_MASK_COLOR_START = '--mask-color-start';
const CSS_VAR_MASK_COLOR_END   = '--mask-color-end';

export default function useMaskedScroll({
  ref: containerRef,
  direction = 'vertical',
  fadeSize = 24,
  animationDuration = 0.3,
  setMaxSize = true,
  hideScrollbar = true,
  // Disable when calling 'updateMask' explicitly
  updateMaskOnEvents = true,
  updateMaskAfterDelay = 0,
  scrollToEndOnMount,
}: {
  ref: RefObject<HTMLDivElement | null>
  updateMaskOnEvents?: boolean
  direction?: 'vertical' | 'horizontal'
  fadeSize?: number
  animationDuration?: number
  setMaxSize?: boolean
  hideScrollbar?: boolean
  updateMaskAfterDelay?: number
  scrollToEndOnMount?: boolean
}) {
  const isVertical = direction === 'vertical';

  const updateMask = useCallback(() => {
    const ref = containerRef?.current;
    if (ref) {
      const start = isVertical
        ? ref.scrollTop < 1
        : ref.scrollLeft < 1;
      const end = isVertical
        ? (ref.scrollHeight - ref.scrollTop) - ref.clientHeight < 1
        : (ref.scrollWidth - ref.scrollLeft) - ref.clientWidth < 1;
      ref.style.setProperty(CSS_VAR_MASK_COLOR_START, start
        ? 'rgba(0, 0, 0, 1)'
        : 'rgba(0, 0, 0, 0)');
      ref.style.setProperty(CSS_VAR_MASK_COLOR_END, end
        ? 'rgba(0, 0, 0, 1)'
        : 'rgba(0, 0, 0, 0)');
    }
  }, [containerRef, isVertical]);

  useEffect(() => {
    // Conditionally track events
    const ref = containerRef?.current;
    if (ref && updateMaskOnEvents) {
      ref.onscroll = updateMask;
      ref.onresize = updateMask;
      return () => {
        ref.onscroll = null;
        ref.onresize = null;
      };
    }
    if (updateMaskAfterDelay) {
      // Update after delay
      const timeout = setTimeout(updateMask, updateMaskAfterDelay);
      return () => clearTimeout(timeout);
    } else {
      // Update on mount
      updateMask();
    }
  }, [containerRef, updateMask, updateMaskOnEvents, updateMaskAfterDelay]);

  useEffect(() => {
    const ref = containerRef?.current;
    const contentRect = ref?.children[0].getBoundingClientRect();
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
    // eslint-disable-next-line max-len
    const gradientStart = `linear-gradient(to ${isVertical ? 'bottom' : 'right'}, var(${CSS_VAR_MASK_COLOR_START}), black ${fadeSize}px)`;
    // eslint-disable-next-line max-len
    const gradientEnd = `linear-gradient(to ${isVertical ? 'top' : 'left'}, var(${CSS_VAR_MASK_COLOR_END}), black ${fadeSize}px)`;
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
          overflowY: 'scroll',
        } : {
          ...setMaxSize && { maxWidth: '100%' },
          overflowX: 'scroll',
        },
    };
  }, [isVertical, fadeSize, animationDuration, hideScrollbar, setMaxSize]);

  return { styleMask, updateMask };
}
