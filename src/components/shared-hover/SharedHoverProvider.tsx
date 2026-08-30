'use client';

import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SharedHoverContext, SharedHoverProps } from './state';
import { AnimatePresence, motion } from 'framer-motion';
import ComponentSurface from '../primitives/surface/ComponentSurface';
import clsx from 'clsx/lite';

type RenderHover = (key: string, content: ReactNode) => void

type HoverContentUpdate = {
  key: string
  content: ReactNode
}

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
  const [hoverProps, setHoverProps] = useState<SharedHoverProps>();
  const [hoverStyle, setHoverStyle] = useState<CSSProperties>();

  const currentTriggerRef = useRef<HTMLElement>(null);
  const renderHoverRef = useRef<RenderHover>(() => {});

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
        setHoverProps(undefined);
        currentTriggerRef.current = null;
      }, delay);
    } else {
      setHoverProps(undefined);
      currentTriggerRef.current = null;
    }
  }, [clearTimeouts]);

  const showHover = useCallback((
    _trigger: HTMLElement | null,
    hover: SharedHoverProps,
  ) => {
    if (_trigger) {
      currentTriggerRef.current = _trigger;
      const displayHover = () => {
        // Update current trigger ref on display
        currentTriggerRef.current = _trigger;
        setHoverProps(hover);
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
      if (hoverProps) {
        // Don't apply delay if hover is already visible
        displayHover();
      } else {
        timeoutInitialHoverRef.current =
          setTimeout(displayHover, DELAY_INITIAL_HOVER);
      }
    }
  }, [hoverProps, clearTimeouts]);

  const dismissHover = useCallback((trigger: HTMLElement | null) => {
    if (trigger === currentTriggerRef.current) {
      clearState(DELAY_DISMISS);
    }
  }, [clearState]);

  const isHoverBeingShown = useCallback((key: string) =>
    Boolean(hoverProps?.key && hoverProps.key === key)
  , [hoverProps]);

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

  // Content state must stay in SharedHoverOverlay: triggers rebuild `content`
  // on every render, so a write that re-renders them never settles
  const renderHover = useCallback<RenderHover>(
    (key, content) => renderHoverRef.current(key, content),
    [],
  );

  const registerRenderHover = useCallback((fn: RenderHover) => {
    renderHoverRef.current = fn;
  }, []);

  const contextValue = useMemo(() => ({
    showHover,
    dismissHover,
    renderHover,
    isHoverBeingShown,
  }), [showHover, dismissHover, renderHover, isHoverBeingShown]);

  return (
    <SharedHoverContext.Provider value={contextValue}>
      {children}
      <SharedHoverOverlay {...{
        hoverProps,
        hoverStyle,
        registerRenderHover,
      }} />
    </SharedHoverContext.Provider>
  );
}

function SharedHoverOverlay({
  hoverProps,
  hoverStyle,
  registerRenderHover,
}: {
  hoverProps?: SharedHoverProps
  hoverStyle?: CSSProperties
  registerRenderHover: (fn: RenderHover) => void
}) {
  const [update, setUpdate] = useState<HoverContentUpdate>();

  useEffect(() => {
    registerRenderHover((key, content) => setUpdate(current =>
      current?.key === key && current.content === content
        ? current
        : { key, content }));
  }, [registerRenderHover]);

  // Prefer the snapshot from `showHover` so the hover never fades in empty,
  // and never repaints the previous trigger's content at the new position
  const hoverContent = update?.key === hoverProps?.key
    ? update?.content
    : hoverProps?.content;

  return (
    <div className="relative inset-0 z-100 pointer-events-none">
      <AnimatePresence>
        {hoverProps &&
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            layoutId="hover"
            className="fixed"
            style={hoverStyle}
          >
            <ComponentSurface
              className="max-w-none p-1!"
              color={hoverProps.color}
            >
              <div
                className={clsx(
                  'relative rounded-[9px] overflow-clip',
                  hoverProps.color !== 'frosted' && 'bg-extra-dim',
                )}
                style={{
                  width: hoverProps.width,
                  height: hoverProps.height,
                }}
              >
                {/* Content */}
                {hoverContent}
                {/* Border */}
                <div className={clsx(
                  'absolute inset-0',
                  'border rounded-[0.25rem]',
                  hoverProps.color === 'frosted'
                    ? 'border-gray-400/25'
                    : 'border-medium',
                )} />
              </div>
            </ComponentSurface>
          </motion.div>}
      </AnimatePresence>
    </div>
  );
}
