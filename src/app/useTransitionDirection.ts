import { useCallback, useRef } from 'react';

export type TransitionDirection = 'left' | 'right' | 'top';

// Enter
const ENTER_VAR = '--photo-enter';
const ENTER_LEFT = 'slide-left-enter';
const ENTER_RIGHT = 'slide-right-enter';
const ENTER_TOP = 'slide-top-enter';

// Exit
const EXIT_VAR = '--photo-exit';
const EXIT_LEFT = 'slide-left-exit';
const EXIT_RIGHT = 'slide-right-exit';
const EXIT_TOP = 'slide-top-exit';

// Defaults
const ENTER_DEFAULT = ENTER_TOP;
const EXIT_DEFAULT = EXIT_TOP;

export default function useTransitionDirection(
  timeoutDelay = 1000,
) {
  const timeout = useRef<NodeJS.Timeout>(null);

  const setTransitionDirection = useCallback((
    direction: TransitionDirection,
  ) => {
    document.documentElement.style.setProperty(
      ENTER_VAR,
      direction === 'left'
        ? ENTER_LEFT
        : direction === 'right'
          ? ENTER_RIGHT
          : ENTER_TOP,
    );
    document.documentElement.style.setProperty(
      EXIT_VAR,
      direction === 'left'
        ? EXIT_LEFT
        : direction === 'right'
          ? EXIT_RIGHT
          : EXIT_TOP,
    );

    if (timeout.current) { clearTimeout(timeout.current); }
    timeout.current = setTimeout(() => {
      console.log('Setting default transition direction');
      document.documentElement.style.setProperty(ENTER_VAR, ENTER_DEFAULT);
      document.documentElement.style.setProperty(EXIT_VAR, EXIT_DEFAULT);
    }, timeoutDelay);
  }, [timeoutDelay]);

  return {
    setTransitionDirection,
  };
}