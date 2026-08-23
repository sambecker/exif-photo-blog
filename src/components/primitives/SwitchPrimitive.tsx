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

  const renderAccessory = (accessory: ReactNode, isActive: boolean) =>
    accessory &&
      <span
        className={clsx(
          'transition-colors ease-out',
          isActive ? 'text-main' : 'text-dim',
        )}
        style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
      >
        {accessory}
      </span>;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1',
        'cursor-pointer',
        className,
      )}
      onClick={() => onCheckedChangeVisual(!checkedVisual)}
    >
      {renderAccessory(accessoryStart, checkedVisual)}
      <Switch.Root
        checked={checkedVisual}
        onCheckedChange={onCheckedChangeVisual}
        // Prevent container from also handling clicks on the switch
        onClick={e => e.stopPropagation()}
        aria-label={label}
        className={clsx(
          'shrink-0 w-[36px] h-[22px] p-0.5',
          // Shed base button styles which add a border and background
          'border-none bg-transparent',
          'rounded-full',
          CONTROL_OUTLINE_CLASSNAME,
          'cursor-pointer',
        )}
      >
        <Switch.Thumb
          className={clsx(
            'block size-4 rounded-full bg-main',
            'border border-dim',
            'shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
            'translate-x-[16px]',
            'transition-transform ease-out',
            'data-[state=checked]:translate-x-0',
          )}
          style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
        />
      </Switch.Root>
      {renderAccessory(accessoryEnd, !checkedVisual)}
    </span>
  );
}
