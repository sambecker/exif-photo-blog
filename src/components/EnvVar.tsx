import clsx from 'clsx/lite';
import { ReactNode } from 'react';
import CopyButton from './CopyButton';
import MaskedScroll from './MaskedScroll';

export default function EnvVar({
  variable,
  value,
  accessory,
  includeCopyButton = true,
  trailingContent,
  className,
}: {
  variable: string,
  value?: string,
  accessory?: ReactNode,
  includeCopyButton?: boolean,
  trailingContent?: ReactNode,
  className?: string,
}) {
  return (
    <MaskedScroll
      direction="horizontal"
      className={clsx(
        'inline-flex max-w-full',
        'overflow-y-hidden',
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
        {accessory}
        {includeCopyButton &&
          <span className="translate-y-[1px]">
            <CopyButton
              className=""
              label={variable}
              text={variable}
              subtle
            />
          </span>}
        {trailingContent &&
          <span className="-ml-0.5">
            {trailingContent}
          </span>}
      </span>
    </MaskedScroll>
  );
}
