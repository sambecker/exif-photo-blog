import clsx from 'clsx/lite';
import CopyButton from './CopyButton';

export default function EnvVar({
  variable,
  value,
  includeCopyButton = true,
}: {
  variable: string,
  value?: string,
  includeCopyButton?: boolean,
}) {
  return (
    <div
      className={clsx(
        'inline-flex',
        'overflow-x-auto overflow-y-hidden',
      )}
    >
      <span className="inline-flex items-center gap-1">
        <span className={clsx(
          'text-[11px] font-medium tracking-wider',
          'px-1 py-[0.5px]',
          'rounded-[4px]',
          'bg-gray-100 dark:bg-gray-800',
        )}>
          {variable}{value && ` = ${value}`}
        </span>
        {includeCopyButton &&
          <CopyButton label={variable} text={variable} subtle />}
      </span>
    </div>
  );
}
