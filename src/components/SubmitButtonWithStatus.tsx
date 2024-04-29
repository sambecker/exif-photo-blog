'use client';

import { HTMLProps, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Spinner, { SpinnerColor } from './Spinner';
import { clsx } from 'clsx/lite';
import { toastSuccess } from '@/toast';

interface Props extends HTMLProps<HTMLButtonElement> {
  icon?: JSX.Element
  styleAsLink?: boolean
  spinnerColor?: SpinnerColor
  onFormStatusChange?: (pending: boolean) => void
  onFormSubmitToastMessage?: string
  onFormSubmit?: () => void
  primary?: boolean
}

export default function SubmitButtonWithStatus({
  icon,
  styleAsLink,
  spinnerColor,
  onFormStatusChange,
  onFormSubmitToastMessage,
  onFormSubmit,
  children,
  disabled,
  className,
  primary,
  type: _type,
  ...buttonProps
}: Props) {
  const { pending } = useFormStatus();

  const pendingPrevious = useRef(pending);

  useEffect(() => {
    if (pending && !pendingPrevious.current) {
      if (onFormSubmitToastMessage) {
        toastSuccess(onFormSubmitToastMessage);
      }
      onFormSubmit?.();
    }
    pendingPrevious.current = pending;
  }, [pending, onFormSubmitToastMessage, onFormSubmit]);

  useEffect(() => {
    onFormStatusChange?.(pending);
  }, [onFormStatusChange, pending]);

  return (
    <button
      type="submit"
      disabled={disabled}
      className={clsx(
        className,
        'inline-flex items-center gap-2',
        primary && 'primary',
        styleAsLink && 'link',
      )}
      {...buttonProps}
    >
      {(icon || pending) &&
        <span className={clsx(
          'h-4',
          'min-w-[1rem]',
          'inline-flex justify-center sm:justify-normal',
          '-mx-0.5',
          'translate-y-[1px]',
        )}>
          {pending
            ? <Spinner size={14} color={spinnerColor} />
            : icon}
        </span>}
      {children && <span className={clsx(
        icon !== undefined && 'hidden sm:inline-block',
      )}>
        {children}
      </span>}
    </button>
  );
};
