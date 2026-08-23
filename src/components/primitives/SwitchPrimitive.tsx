'use client';

import { clsx } from 'clsx/lite';
import * as Switch from '@radix-ui/react-switch';
import { CONTROL_OUTLINE_CLASSNAME } from '..';
import {
  ComponentProps,
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Tooltip from '../Tooltip';

const TRANSITION_DURATION = 200;

export default function SwitchPrimitive({
  checked = false,
  onCheckedChange,
  label,
  accessoryStart,
  accessoryEnd,
  tooltip,
  className,
}: {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label: string
  accessoryStart?: ReactNode
  accessoryEnd?: ReactNode
  tooltip?: ComponentProps<typeof Tooltip>
  className?: string
}) {
  // Track thumb position separately from the consumer's state so the
  // animation can complete before triggering potentially expensive work
  const [checkedVisual, setCheckedVisual] = useState(checked);
  const [checkedSynced, setCheckedSynced] = useState(checked);

  // Follow the consumer if it changes state independently of the thumb
  if (checkedSynced !== checked) {
    setCheckedSynced(checked);
    setCheckedVisual(checked);
  }

  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const onCheckedChangeVisual = useCallback((updatedChecked: boolean) => {
    setCheckedVisual(updatedChecked);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(
      () => onCheckedChange?.(updatedChecked),
      TRANSITION_DURATION,
    );
  }, [onCheckedChange]);

  const renderAccessory = (
    accessory: ReactNode,
    side: 'start' | 'end',
    isVisible: boolean,
  ) =>
    accessory &&
      <span
        aria-hidden
        className={clsx(
          'absolute inset-y-0 flex items-center justify-center',
          'pointer-events-none',
          'text-main',
          'w-7.5',
          'transition-opacity ease-out',
          side === 'start' ? 'right-[3px]' : 'left-[3px]',
        )}
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
      >
        {accessory}
      </span>;

  const switchControl = (
    <span className={clsx('inline-flex items-center', className)}>
      <Switch.Root
        checked={checkedVisual}
        onCheckedChange={onCheckedChangeVisual}
        aria-label={label}
        className={clsx(
          'relative shrink-0',
          'w-[50px] h-[24px] p-[5px]',
          // Shed base button styles which add a border and background
          'border-none bg-transparent hover:bg-extra-dim active:bg-dim',
          'rounded-full',
          CONTROL_OUTLINE_CLASSNAME,
          'cursor-pointer',
        )}
      >
        {renderAccessory(accessoryEnd, 'end', !checkedVisual)}
        {renderAccessory(accessoryStart, 'start', checkedVisual)}
        <Switch.Thumb
          className={clsx(
            'relative z-10 block',
            'transition-transform ease-out',
            'translate-x-[28px]',
            'data-[state=checked]:translate-x-0',
          )}
          style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
        >
          <SVGDot className="text-gray-300 dark:text-gray-600/90" />
        </Switch.Thumb>
      </Switch.Root>
    </span>
  );

  return tooltip?.content
    ? <Tooltip delayDuration={500} {...tooltip}>
      {switchControl}
    </Tooltip>
    : switchControl;
}

// Necessary to render 1.25px stroke width
// Border/Outline snap to 1px or 1.5px
function SVGDot({
  size = 12,
  className,
  style,
}: {
  size?: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 1}
        fill="currentColor"
        strokeWidth={1.25}
      />
    </svg>
  );
}
