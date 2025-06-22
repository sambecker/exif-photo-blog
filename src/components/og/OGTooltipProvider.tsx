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

const DISMISS_DELAY = 200;

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

  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const showTooltip = useCallback((
    _trigger: HTMLElement | null,
    tooltip: Tooltip,
  ) => {
    if (!_trigger) { return; }
    setCurrentTooltip(tooltip);
    currentTriggerRef.current = _trigger;
    const trigger = _trigger.getBoundingClientRect();
    const top =
      trigger.top - (tooltip.height + TOOLTIP_MARGIN) < VIEWPORT_SAFE_AREA
        // Tooltip below trigger
        ? trigger.bottom + TOOLTIP_MARGIN + tooltip.offsetBelow
        // Tooltip above trigger
        : trigger.top - (tooltip.height + TOOLTIP_MARGIN) + tooltip.offsetAbove;
    const horizontalOffset =
      window.innerWidth - (trigger.left + tooltip.width) < VIEWPORT_SAFE_AREA
        ? { right: VIEWPORT_SAFE_AREA }
        : { left: trigger.left };
    setTooltipStyle({ top, ...horizontalOffset });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const dismissTooltip = useCallback((
    trigger: HTMLElement | null,
  ) => {
    if (trigger === currentTriggerRef.current) {
      timeoutRef.current = setTimeout(() => {
        setCurrentTooltip(undefined);
        currentTriggerRef.current = null;
      }, DISMISS_DELAY);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (currentTooltip) {
        setCurrentTooltip(undefined);
        currentTriggerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentTooltip]);

  return (
    <OGTooltipContext.Provider
      value={{
        showTooltip,
        dismissTooltip,
      }}
    >
      <div className="relative inset-0 z-50 pointer-events-none">
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
              <MenuSurface className="max-w-none p-1!">
                {currentTooltip.content}
              </MenuSurface>
            </motion.div>}
        </AnimatePresence>
      </div>
      {children}
    </OGTooltipContext.Provider>
  );
}
