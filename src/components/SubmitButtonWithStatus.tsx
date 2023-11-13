'use client';

import { HTMLProps, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Spinner, { SpinnerColor } from './Spinner';
import { cc } from '@/utility/css';
import { toastSuccess } from '@/toast';

interface Props extends HTMLProps<HTMLButtonElement> {
  icon?: JSX.Element
  styleAsLink?: boolean
  spinnerColor?: SpinnerColor
  onFormSubmitToastMessage?: string
}

export default function SubmitButtonWithStatus({
  icon,
  styleAsLink,
  spinnerColor,
  onFormSubmitToastMessage,
  children,
  disabled,
  className,
  type: _type,
  ...buttonProps
}: Props) {

  const { pending } = useFormStatus();
  const pendingPrevious = useRef(pending);

  useEffect(() => {
    if (
      pendingPrevious.current &&
      !pending &&
      onFormSubmitToastMessage
    ) {
      toastSuccess(onFormSubmitToastMessage);
    }
    pendingPrevious.current = pending;
  }, [pending, onFormSubmitToastMessage]);

  return (
    <button
      type="submit"
      disabled={disabled}
      className={cc(
        className,
        'inline-flex items-center gap-2',
        styleAsLink && 'link',
      )}
      {...buttonProps}
    >
      {(icon || pending) &&
        <span className={cc(
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
      {children && <span className={cc(
        icon !== undefined && 'hidden sm:inline-block',
      )}>
        {children}
      </span>}
    </button>
  );
};
