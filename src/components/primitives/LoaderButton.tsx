'use client';

import Spinner, { SpinnerColor } from '@/components/Spinner';
import { clsx } from 'clsx/lite';
import {
  ButtonHTMLAttributes,
  ComponentProps,
  ReactNode,
  RefObject,
} from 'react';
import Tooltip from '../Tooltip';

export default function LoaderButton({
  ref,
  children,
  classNameIcon,
  isLoading,
  icon,
  spinnerColor,
  spinnerClassName,
  styleAs = 'button',
  hideText = 'on-mobile',
  confirmText,
  shouldPreventDefault,
  primary,
  hideFocusOutline,
  type = 'button',
  onClick,
  disabled,
  className,
  tooltip,
  tooltipColor,
  tooltipSide,
  ...rest
}: {
  ref?: RefObject<HTMLButtonElement | null>
  classNameIcon?: string
  isLoading?: boolean
  icon?: ReactNode
  spinnerColor?: SpinnerColor
  spinnerClassName?: string
  styleAs?: 'button' | 'link' | 'link-without-hover'
  hideText?: 'always' | 'on-mobile' | 'never'
  confirmText?: string
  shouldPreventDefault?: boolean
  primary?: boolean
  hideFocusOutline?: boolean
  tooltip?: string
  tooltipColor?: ComponentProps<typeof Tooltip>['color']
  tooltipSide?: ComponentProps<typeof Tooltip>['side']
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const button =
    <button
      {...rest}
      ref={ref}
      type={type}
      onClick={e => {
        if (shouldPreventDefault) { e.preventDefault(); }
        if (!confirmText || confirm(confirmText)) {
          onClick?.(e);
        }
      }}
      className={clsx(
        'font-mono',
        ...(styleAs !== 'button'
          ? [
            'link h-4 active:text-medium',
            'disabled:bg-transparent!',
          ]
          : ['h-9']
        ),
        styleAs === 'link' && 'hover:text-dim',
        styleAs === 'link-without-hover' && 'hover:text-main',
        'inline-flex items-center gap-1.5 self-start whitespace-nowrap',
        primary && 'primary',
        hideFocusOutline && 'focus:outline-hidden',
        className,
      )}
      disabled={isLoading || disabled}
    >
      {(icon || isLoading) &&
        <span className={clsx(
          'min-w-[1.25rem] max-h-5',
          styleAs === 'button' ? 'translate-y-[-0.5px]' : 'translate-y-[0.5px]',
          'inline-flex justify-center shrink-0',
          classNameIcon,
        )}>
          {isLoading
            ? <Spinner
              size={14}
              color={spinnerColor}
              className={clsx(
                'translate-y-[0.5px]',
                spinnerClassName,
              )}
            />
            : icon}
        </span>}
      {children && <span className={clsx(
        styleAs !== 'button' && isLoading && 'text-dim',
        hideText === 'on-mobile' && icon !== undefined && 'max-sm:hidden',
        hideText === 'always' && 'hidden',
      )}>
        {children}
      </span>}
    </button>;

  return (
    tooltip
      ? <Tooltip
        content={tooltip}
        color={tooltipColor}
        side={tooltipSide}
      >
        {button}
      </Tooltip>
      : button
  );
}
