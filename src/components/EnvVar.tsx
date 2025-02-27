import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import CopyButton from './CopyButton';

export default function EnvVar({
  variable,
  value,
  includeCopyButton = true,
  trailingContent,
  className,
}: {
  variable: string,
  value?: string,
  includeCopyButton?: boolean,
  trailingContent?: ReactNode,
  className?: string,
}) {
  return (
    <div
      className={clsx(
        'inline-flex max-w-full',
        'overflow-x-auto overflow-y-hidden',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        <span className={clsx(
          'px-1.5 rounded-md',
          'text-[11px] font-medium tracking-wider',
          'text-gray-600 dark:text-gray-300',
          'bg-gray-100 dark:bg-gray-800',
          'whitespace-nowrap',
        )}>
          {variable}{value && ` = ${value}`}
        </span>
        {includeCopyButton &&
          <CopyButton
            className="translate-y-[0.5px]"
            label={variable}
            text={variable}
            subtle
          />}
        {trailingContent}
      </span>
    </div>
  );
}
