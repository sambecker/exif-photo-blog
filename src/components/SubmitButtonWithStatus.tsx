'use client';

import { HTMLProps } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import Spinner from './Spinner';
import { cc } from '@/utility/css';

interface Props extends HTMLProps<HTMLButtonElement> {
  icon?: JSX.Element
}

export default function SubmitButtonWithStatus(props: Props) {
  const {
    icon,
    children,
    disabled,
    className,
    type: _type,
    ...buttonProps
  } = props;

  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled}
      className={cc(
        className,
        'inline-flex items-center gap-2',
      )}
      {...buttonProps}
    >
      {(icon || pending) &&
        <span className={cc(
          'min-w-[1rem]',
          'inline-flex justify-center sm:justify-normal',
          '-mx-0.5',
        )}>
          {pending
            ? <Spinner size={14} />
            : icon}
        </span>}
      <span className={cc(
        icon !== undefined && 'hidden sm:inline-block',
      )}>
        {children}
      </span>
    </button>
  );
};
