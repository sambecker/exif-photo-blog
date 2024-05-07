import Spinner, { SpinnerColor } from '@/components/Spinner';
import { clsx } from 'clsx/lite';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export default function LoaderButton(props: {
  children?: ReactNode
  isLoading?: boolean
  icon?: JSX.Element
  spinnerColor?: SpinnerColor
  styleAsLink?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const {
    children,
    isLoading,
    icon,
    spinnerColor,
    styleAsLink,
    type = 'button',
    disabled,
    className,
    ...rest
  } = props;
  return (
    <button
      {...rest}
      type={type}
      className={clsx(
        className,
        styleAsLink
          ? 'link h-4 hover:text-dim active:text-medium'
          : 'h-9',
        'inline-flex items-center gap-2 self-start',
      )}
      disabled={isLoading || disabled}
    >
      {(icon || isLoading) &&
        <span className={clsx(
          'min-w-[1.25rem] h-4 translate-y-[-0.5px]',
          'inline-flex justify-center',
        )}>
          {isLoading
            ? <Spinner
              size={14}
              color={spinnerColor}
              className="translate-y-[2px]"
            />
            : icon}
        </span>}
      {children && <span className={clsx(
        icon !== undefined && 'hidden sm:inline-block',
      )}>
        {children}
      </span>}
    </button>
  );
}
