'use client';

import clsx from 'clsx/lite';
import { FaPlus } from 'react-icons/fa6';
import Tooltip from '@/components/Tooltip';
import { useRef } from 'react';

export default function PhotoRecipeOverlayButton({
  className,
  toggleRecipeOverlay,
  shouldShowRecipeOverlay,
}: {
  className?: string
  toggleRecipeOverlay: () => void
  shouldShowRecipeOverlay?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Tooltip content="Recipe Info">
      <button
        ref={ref}
        onClick={() => {
          toggleRecipeOverlay?.();
          // Avoid unexpected tooltip trigger
          ref.current?.blur();
        }}
        className={clsx(
          'text-medium',
          'border-medium rounded-md shadow-none',
          'px-[3px] py-[3px] my-[-3px]',
          'hover:bg-extra-dim active:bg-dim',
          className,
        )}>
        <FaPlus
          className={clsx(
            'transition-transform',
            shouldShowRecipeOverlay && 'rotate-45',
          )}
          size={10}
        />
      </button>
    </Tooltip>
  );
}
