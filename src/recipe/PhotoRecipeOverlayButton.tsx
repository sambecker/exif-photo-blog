'use client';

import clsx from 'clsx/lite';
import { FaPlus } from 'react-icons/fa6';
import Tooltip from '@/components/Tooltip';
import { useRef } from 'react';
import { useAppText } from '@/i18n/state/client';

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

  const appText = useAppText();

  return (
    <Tooltip content={appText.tooltip.recipeInfo}>
      <button
        ref={ref}
        type="button"
        onClick={() => {
          toggleRecipeOverlay?.();
          // Avoid unexpected tooltip trigger
          ref.current?.blur();
        }}
        className={clsx(
          'text-medium hover:text-main',
          'bg-dim hover:bg-medium active:bg-dim',
          'rounded-md border-transparent shadow-none',
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
