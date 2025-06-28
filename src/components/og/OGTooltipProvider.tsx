'use client';

import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { OGTooltipContext, Tooltip } from './state';
import { AnimatePresence, motion } from 'framer-motion';
import MenuSurface from '../primitives/MenuSurface';

const DELAY_INITIAL_HOVER = 200;
const DELAY_DISMISS = 200;

const VIEWPORT_SAFE_AREA = 12;
const TOOLTIP_MARGIN = 12;

export default function OGTooltipProvider({
  children,
}: {
  children: ReactNode
}) {
  const [currentTooltip, setCurrentTooltip] = useState<Tooltip>();
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>();

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
        setCurrentTooltip(undefined);
        currentTriggerRef.current = null;
      }, delay);
    } else {
      setCurrentTooltip(undefined);
      currentTriggerRef.current = null;
    }
  }, [clearTimeouts]);

  const showTooltip = useCallback((
    _trigger: HTMLElement | null,
    tooltip: Tooltip,
  ) => {
    if (_trigger) {
      currentTriggerRef.current = _trigger;
      const displayTooltip = () => {
        // Update current trigger ref on display
        currentTriggerRef.current = _trigger;
        setCurrentTooltip(tooltip);
        const trigger = _trigger.getBoundingClientRect();
        const top =
          trigger.top - (tooltip.height + TOOLTIP_MARGIN) < VIEWPORT_SAFE_AREA
            // Position below trigger
            ? trigger.bottom + TOOLTIP_MARGIN + tooltip.offsetBelow
            // Position above trigger
            : trigger.top - (tooltip.height + TOOLTIP_MARGIN)
              + tooltip.offsetAbove;
        const horizontalOffset =
          // eslint-disable-next-line max-len
          window.innerWidth - (trigger.left + tooltip.width) < VIEWPORT_SAFE_AREA
            ? { right: VIEWPORT_SAFE_AREA }
            : { left: trigger.left };
        setTooltipStyle({ top, ...horizontalOffset });
        clearTimeouts();
      };
      if (currentTooltip) {
        // Don't apply delay if tooltip's already visible
        displayTooltip();
      } else {
        timeoutInitialHoverRef.current =
          setTimeout(displayTooltip, DELAY_INITIAL_HOVER);
      }
    }
  }, [currentTooltip, clearTimeouts]);

  const dismissTooltip = useCallback((trigger: HTMLElement | null) => {
    if (trigger === currentTriggerRef.current) {
      clearState(DELAY_DISMISS);
    }
  }, [clearState]);

  useEffect(() => {
    const onWindowChange = () => clearState(0);
    window.addEventListener('mouseup', onWindowChange);
    window.addEventListener('mousewheel', onWindowChange);
    window.addEventListener('resize', onWindowChange);
    return () => {
      window.removeEventListener('mouseup', onWindowChange);
      window.removeEventListener('mousewheel', onWindowChange);
      window.removeEventListener('resize', onWindowChange);
    };
  }, [clearState]);

  return (
    <OGTooltipContext.Provider value={{ showTooltip, dismissTooltip }}>
      <div className="relative inset-0 z-100 pointer-events-none">
        <AnimatePresence>
          {currentTooltip &&
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              layoutId="tooltip"
              className="fixed"
              style={tooltipStyle}
            >
              <MenuSurface
                className="max-w-none p-1!"
                color={currentTooltip.color}
              >
                {currentTooltip.content}
              </MenuSurface>
            </motion.div>}
        </AnimatePresence>
      </div>
      {children}
    </OGTooltipContext.Provider>
  );
}
