'use client';

import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SharedHoverContext, SharedHoverData } from './state';
import { AnimatePresence, motion } from 'framer-motion';
import MenuSurface from '../primitives/MenuSurface';

const WINDOW_CHANGE_EVENTS = ['mouseup', 'mousewheel', 'resize'];

const DELAY_INITIAL_HOVER = 200;
const DELAY_DISMISS = 200;

const VIEWPORT_SAFE_AREA = 12;
const HOVER_MARGIN = 12;

export default function SharedHoverProvider({
  children,
}: {
  children: ReactNode
}) {
  const [currentHover, setCurrentHover] = useState<SharedHoverData>();
  const [hoverStyle, setHoverStyle] = useState<CSSProperties>();

  const currentTriggerRef = useRef<HTMLElement>(null);

  const timeoutInitialHoverRef = useRef<NodeJS.Timeout>(undefined);
  const timeoutDismissRef = useRef<NodeJS.Timeout>(undefined);

  const clearTimeouts = useCallback(() => {
    clearTimeout(timeoutInitialHoverRef.current);
    timeoutInitialHoverRef.current = undefined;
    clearTimeout(timeoutDismissRef.current);
    timeoutDismissRef.current = undefined;
  }, []);

  const clearState = useCallback((delay = 0) => {
    clearTimeouts();
    if (delay) {
      timeoutDismissRef.current = setTimeout(() => {
        setCurrentHover(undefined);
        currentTriggerRef.current = null;
      }, delay);
    } else {
      setCurrentHover(undefined);
      currentTriggerRef.current = null;
    }
  }, [clearTimeouts]);

  const showHover = useCallback((
    _trigger: HTMLElement | null,
    hover: SharedHoverData,
  ) => {
    if (_trigger) {
      currentTriggerRef.current = _trigger;
      const displayHover = () => {
        // Update current trigger ref on display
        currentTriggerRef.current = _trigger;
        setCurrentHover(hover);
        const trigger = _trigger.getBoundingClientRect();
        const top =
          trigger.top - (hover.height + HOVER_MARGIN) < VIEWPORT_SAFE_AREA
            // Position below trigger
            ? trigger.bottom + HOVER_MARGIN + hover.offsetBelow
            // Position above trigger
            : trigger.top - (hover.height + HOVER_MARGIN)
              + hover.offsetAbove;
        const horizontalOffset =
          window.innerWidth - (trigger.left + hover.width) < VIEWPORT_SAFE_AREA
            ? { right: VIEWPORT_SAFE_AREA }
            : { left: trigger.left };
        setHoverStyle({ top, ...horizontalOffset });
        clearTimeouts();
      };
      if (currentHover) {
        // Don't apply delay if hover is already visible
        displayHover();
      } else {
        timeoutInitialHoverRef.current =
          setTimeout(displayHover, DELAY_INITIAL_HOVER);
      }
    }
  }, [currentHover, clearTimeouts]);

  const dismissHover = useCallback((trigger: HTMLElement | null) => {
    if (trigger === currentTriggerRef.current) {
      clearState(DELAY_DISMISS);
    }
  }, [clearState]);

  const isHoverBeingShown = useCallback((key: string) =>
    Boolean(currentHover?.key && currentHover.key === key)
  , [currentHover]);

  useEffect(() => {
    const onWindowChange = () => clearState(0);
    WINDOW_CHANGE_EVENTS.forEach(event => {
      window.addEventListener(event, onWindowChange);
    });
    return () => {
      WINDOW_CHANGE_EVENTS.forEach(event => {
        window.removeEventListener(event, onWindowChange);
      });
    };
  }, [clearState]);

  return (
    <SharedHoverContext.Provider
      value={{
        showHover,
        dismissHover,
        isHoverBeingShown,
      }}
    >
      <div className="relative inset-0 z-100 pointer-events-none">
        <AnimatePresence>
          {currentHover &&
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              layoutId="hover"
              className="fixed"
              style={hoverStyle}
            >
              <MenuSurface
                className="max-w-none p-1!"
                color={currentHover.color}
              >
                <div
                  className={currentHover.className}
                  style={{
                    width: currentHover.width,
                    height: currentHover.height,
                  }}
                >
                  {currentHover.content}
                </div>
              </MenuSurface>
            </motion.div>}
        </AnimatePresence>
      </div>
      {children}
    </SharedHoverContext.Provider>
  );
}
