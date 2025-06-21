'use client';

import {
  CSSProperties,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { OGTooltipContext } from './state';
import { AnimatePresence, motion } from 'framer-motion';
import MenuSurface from '../primitives/MenuSurface';

export default function OGTooltipProvider({
  children,
}: {
  children: ReactNode
}) {
  const [tooltip, setTooltip] =
    useState<ReactNode | undefined>(undefined);
  const [triggerElement, setTriggerElement] =
    useState<HTMLElement | undefined>(undefined);
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>();

  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const onMouseEnter = useCallback((
    { currentTarget }: MouseEvent<HTMLElement>,
    tooltip: ReactNode,
  ) => {
    setTooltip(tooltip);
    setTriggerElement(currentTarget);
    const rect = currentTarget.getBoundingClientRect();
    console.log(rect);
    setTooltipStyle({
      top: rect.top + 20,
      left: rect.left,
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const onMouseLeave = useCallback((
    { currentTarget }: MouseEvent<HTMLElement>,
  ) => {
    if (currentTarget === triggerElement) {
      timeoutRef.current = setTimeout(() => {
        setTooltip(undefined);
        setTriggerElement(undefined);
      }, 200);
    }
  }, [triggerElement]);

  useEffect(() => {
    const onScroll = () => {
      if (tooltip) {
        setTooltip(undefined);
        setTriggerElement(undefined);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [tooltip]);

  return (
    <OGTooltipContext.Provider
      value={{
        onMouseEnter,
        onMouseLeave,
      }}
    >
      <div className="relative inset-0 z-50 pointer-events-none">
        <AnimatePresence>
          {tooltip &&
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
                {tooltip}
              </MenuSurface>
            </motion.div>}
        </AnimatePresence>
      </div>
      {children}
    </OGTooltipContext.Provider>
  );
}
