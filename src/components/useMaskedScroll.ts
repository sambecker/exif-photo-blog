import {
  CSSProperties,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

const CSS_VAR_START = '--mask-start';
const CSS_VAR_END   = '--mask-end';

export interface MaskedScrollExternalProps {
  direction?: 'vertical' | 'horizontal'
  fadeSize?: number
  animationDuration?: number
  scrollToEndOnMount?: boolean
}

export default function useMaskedScroll({
  ref: containerRef,
  direction = 'vertical',
  fadeSize = 24,
  animationDuration = 0.3,
  // Disable when calling 'updateMask' explicitly
  updateMaskOnEvents = true,
  scrollToEndOnMount,
}: MaskedScrollExternalProps & {
  ref: RefObject<HTMLDivElement | null>
  updateMaskOnEvents?: boolean
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
      ref.style.setProperty(CSS_VAR_START, `${!start ? fadeSize : 0}px`);
      ref.style.setProperty(CSS_VAR_END, `${!end ? fadeSize : 0}px`);
    }
  }, [containerRef, fadeSize, isVertical]);

  useEffect(() => {
    const ref = containerRef?.current;
    if (ref) {
      updateMask();
      if (updateMaskOnEvents) {
        ref.onscroll = updateMask;
        ref.onresize = updateMask;
        return () => {
          ref.onscroll = null;
          ref.onresize = null;
        };
      }
    }
  }, [containerRef, updateMask, updateMaskOnEvents]);

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
        name: CSS_VAR_START,
        syntax: '<length>',
        initialValue: '0px',
        inherits: false,
      });
      window.CSS.registerProperty({
        name: CSS_VAR_END,
        syntax: '<length>',
        initialValue: '0px',
        inherits: false,
      });
    } catch {}
  }, []);

  const maskStyle: CSSProperties = useMemo(() => {
    // eslint-disable-next-line max-len
    const gradientStart = `linear-gradient(to ${isVertical ? 'bottom' : 'right'}, transparent, black var(${CSS_VAR_START}))`;
    // eslint-disable-next-line max-len
    const gradientEnd = `linear-gradient(to ${isVertical ? 'top' : 'left'}, transparent, black var(${CSS_VAR_END}))`;
    const maskImage = [gradientStart, gradientEnd].join(', ');
    const transition = [
      `${CSS_VAR_START} ${animationDuration}s ease-in-out`,
      `${CSS_VAR_END} ${animationDuration}s ease-in-out`,
    ].join(', ');
    return {
      maskImage,
      maskComposite: 'intersect',
      maskRepeat: 'no-repeat',
      transition,
    };
  }, [isVertical, animationDuration]);

  return { maskStyle, updateMask };
}
