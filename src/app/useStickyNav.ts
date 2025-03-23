import useScrollDirection from '@/utility/useScrollDirection';
import { RefObject } from 'react';

export default function useStickyNav(
  ref: RefObject<HTMLElement | null>,
  isEnabled = true,
) {
  const { scrollDirection, lastScrollY } = useScrollDirection();

  const navHeight = ref.current?.clientHeight ?? 0;

  const hasScrolledPastNav = lastScrollY > navHeight;

  const isNavSticky = isEnabled && (
    hasScrolledPastNav ||
    scrollDirection === 'up'
  );

  const shouldHideStickyNav =
    isNavSticky &&
    scrollDirection === 'down';

  const shouldAnimateStickyNav =
    isNavSticky &&
    lastScrollY > navHeight * 2 ||
    scrollDirection === 'up';

  return {
    isNavSticky,
    shouldHideStickyNav,
    shouldAnimateStickyNav,
  };
};
