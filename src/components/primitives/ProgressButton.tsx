'use client';

import { ComponentProps } from 'react';
import LoaderButton from './LoaderButton';
import { clsx } from 'clsx/lite';
import ProgressBar from './ProgressBar';

export default function ProgressButton({
  progress,
  isLoading,
  className,
  children,
  ...props
}: {
  progress?: number
} & ComponentProps<typeof LoaderButton>) {
  return (
    <LoaderButton
      {...props}
      isLoading={isLoading ?? ((progress ?? 1) < 1)}
      className={clsx(
        'relative overflow-hidden justify-center',
        className,
      )}
    >
      <ProgressBar
        progress={progress}
        className="absolute! top-0 left-0 w-full h-[2px]"
      />
      {children}
    </LoaderButton>
  );
}
