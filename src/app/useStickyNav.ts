import useScrollDirection from '@/utility/useScrollDirection';
import clsx from 'clsx/lite';
import { RefObject, useMemo } from 'react';

export default function useStickyNav(
  ref: RefObject<HTMLElement | null>,
  isEnabled = true,
) {
  const { scrollDirection, scrollY } = useScrollDirection();

  const navHeight = ref.current?.clientHeight ?? 0;

  const hasScrolledPastNav = scrollY > navHeight;

  const isNavSticky = isEnabled && (
    hasScrolledPastNav ||
    scrollDirection === 'up'
  );

  const shouldHideStickyNav =
    isNavSticky &&
    scrollDirection === 'down';

  const shouldAnimateStickyNav =
    isNavSticky && (
      scrollY > navHeight * 2 ||
      scrollDirection === 'up'
    );

  const classNames = useMemo(() => ({
    classNameStickyContainer: clsx(
      isNavSticky && 'sticky top-0 z-10 pointer-events-none',
    ),
    classNameStickyNav: clsx(
      shouldHideStickyNav ? 'translate-y-[-100%]' : 'translate-y-0',
      shouldAnimateStickyNav && 'transition-transform duration-200',
    ),
  }), [isNavSticky, shouldAnimateStickyNav, shouldHideStickyNav]);

  return {
    ...classNames,
    isNavVisible: !shouldHideStickyNav,
  };
};
