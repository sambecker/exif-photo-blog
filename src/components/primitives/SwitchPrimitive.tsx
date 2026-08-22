'use client';

import { clsx } from 'clsx/lite';
import * as Switch from '@radix-ui/react-switch';
import { useCallback, useEffect, useRef, useState } from 'react';

const TRANSITION_DURATION = 200;

export default function SwitchPrimitive({
  checked = false,
  onCheckedChange,
  label,
  className,
}: {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label: string
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

  return (
    <Switch.Root
      checked={checkedVisual}
      onCheckedChange={onCheckedChangeVisual}
      aria-label={label}
      className={clsx(
        'shrink-0 w-[36px] h-[22px] p-0.5',
        'rounded-full bg-medium',
        'data-[state=checked]:bg-invert',
        'transition-colors ease-out',
        'cursor-pointer',
        className,
      )}
      style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
    >
      <Switch.Thumb
        className={clsx(
          'block size-4 rounded-full bg-main',
          'shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
          'transition-transform ease-out',
          'data-[state=checked]:translate-x-[14px]',
        )}
        style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
      />
    </Switch.Root>
  );
}
