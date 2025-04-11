'use client';

import clsx from 'clsx/lite';
import { FaPlus } from 'react-icons/fa6';
import Tooltip from '@/components/Tooltip';
import { useRef } from 'react';

export default function PhotoRecipeOverlayButton({
  className,
  toggleRecipeOverlay,
  isShowingRecipeOverlay,
}: {
  className?: string
  toggleRecipeOverlay: () => void
  isShowingRecipeOverlay?: boolean
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
          'rounded-md shadow-none',
          'border-[1.5px] border-medium',
          'p-0 inline-flex items-center justify-center',
          'size-[17px] sm:size-5',
          'hover:bg-extra-dim active:bg-dim',
          className,
        )}>
        <FaPlus
          className={clsx(
            'transition-transform',
            isShowingRecipeOverlay && 'rotate-45',
          )}
          size={10}
        />
      </button>
    </Tooltip>
  );
}
