'use client';

import { clsx } from 'clsx/lite';
import * as Switch from '@radix-ui/react-switch';
import { CONTROL_OUTLINE_CLASSNAME } from '..';
import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

const TRANSITION_DURATION = 200;

export default function SwitchPrimitive({
  checked = false,
  onCheckedChange,
  label,
  accessoryStart,
  accessoryEnd,
  className,
}: {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label: string
  accessoryStart?: ReactNode
  accessoryEnd?: ReactNode
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
          // '[&>svg]:w-4 [&>svg]:h-auto',
          'w-8',
          'transition-opacity ease-out',
          side === 'start' ? 'right-2' : 'left-2',
        )}
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
      >
        {accessory}
      </span>;

  return (
    <span className={clsx('inline-flex items-center', className)}>
      <Switch.Root
        checked={checkedVisual}
        onCheckedChange={onCheckedChangeVisual}
        aria-label={label}
        className={clsx(
          'relative shrink-0',
          'w-[66px] h-[26px] p-[4px]',
          // Shed base button styles which add a border and background
          'border-none bg-transparent active:bg-extra-dim',
          'rounded-full',
          CONTROL_OUTLINE_CLASSNAME,
          'cursor-pointer',
        )}
      >
        {renderAccessory(accessoryEnd, 'end', !checkedVisual)}
        {renderAccessory(accessoryStart, 'start', checkedVisual)}
        <Switch.Thumb
          className={clsx(
            'relative z-10 block size-4 rounded-full bg-main',
            'border border-dim',
            // 'shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
            'translate-x-[42px]',
            'transition-transform ease-out',
            'data-[state=checked]:translate-x-0',
          )}
          style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
        />
      </Switch.Root>
    </span>
  );
}
