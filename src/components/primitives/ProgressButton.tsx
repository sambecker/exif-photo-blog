'use client';

import { ComponentProps } from 'react';
import LoaderButton from './LoaderButton';
import { clsx } from 'clsx/lite';

const PROGRESS_PADDING = 0.1;

export default function ProgressButton({
  progress,
  isLoading,
  className,
  children,
  ...props
}: {
  progress?: number
} & ComponentProps<typeof LoaderButton>) {
  const progressPadded =
    PROGRESS_PADDING + (progress ?? 0) * (1 - PROGRESS_PADDING);
  return (
    <LoaderButton
      {...props}
      isLoading={isLoading ?? ((progress ?? 1) < 1)}
      className={clsx(
        'relative overflow-hidden justify-center',
        className,
      )}
    >
      <div
        style={{ transform: `scaleX(${progressPadded})`}}
        className={clsx(
          'absolute top-0 left-0 w-full',
          'transition-all duration-500 origin-left',
          'bg-invert h-[2px]',
          progress === undefined ? 'opacity-0' : 'opacity-100',
        )}
      />
      {children}
    </LoaderButton>
  );
}
