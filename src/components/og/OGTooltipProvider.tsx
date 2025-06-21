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
    trigger: HTMLElement | null,
    tooltip: Tooltip,
  ) => {
    if (trigger) {
      setCurrentTooltip(tooltip);
      currentTriggerRef.current = trigger;
      const rect = trigger.getBoundingClientRect();
      setTooltipStyle({
        top: rect.top - tooltip.height - 12,
        left: rect.left,
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    }
  }, []);

  const dismissTooltip = useCallback((
    trigger: HTMLElement | null,
  ) => {
    if (trigger === currentTriggerRef.current) {
      timeoutRef.current = setTimeout(() => {
        setCurrentTooltip(undefined);
        currentTriggerRef.current = null;
      }, 200);
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
