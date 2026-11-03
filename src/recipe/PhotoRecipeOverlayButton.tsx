'use client';

import clsx from 'clsx/lite';
import { FaPlus } from 'react-icons/fa6';
import Tooltip from '@/components/Tooltip';
import { ComponentPropsWithoutRef, Ref, useRef } from 'react';
import { useAppText } from '@/i18n/state/client';

export default function PhotoRecipeOverlayButton({
  ref: forwardedRef,
  className,
  toggleRecipeOverlay,
  isShowingRecipeOverlay,
  onClick,
  ...props
}: {
  ref?: Ref<HTMLButtonElement>
  toggleRecipeOverlay?: () => void
  isShowingRecipeOverlay?: boolean
} & ComponentPropsWithoutRef<'button'>) {
  const ref = useRef<HTMLButtonElement>(null);

  const appText = useAppText();

  return (
    <Tooltip content={appText.tooltip.recipeInfo} triggerIsFocusable>
      <button
        {...props}
        ref={node => {
          ref.current = node;
          if (typeof forwardedRef === 'function') {
            return forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        type="button"
        onClick={event => {
          onClick?.(event);
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
