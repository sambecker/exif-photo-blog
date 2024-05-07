'use client';

import { HTMLProps, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { SpinnerColor } from './Spinner';
import { clsx } from 'clsx/lite';
import { toastSuccess } from '@/toast';
import LoaderButton from '@/components/primitives/LoaderButton';

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
    <LoaderButton
      type="submit"
      disabled={disabled}
      className={clsx(
        className,
        'inline-flex items-center gap-2',
        primary && 'primary',
      )}
      icon={icon}
      spinnerColor={spinnerColor}
      styleAsLink={styleAsLink}
      isLoading={pending}
      {...buttonProps}
    >
      {children}
    </LoaderButton>
  );
};
