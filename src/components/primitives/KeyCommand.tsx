import clsx from 'clsx/lite';
import { useMemo } from 'react';

export default function KeyCommand({
  children,
  modifier,
  className,
}: {
  children: string
  modifier?: '⌘' | '⌥' | '⇧' | '⌃' | '⏎'
  className?: string
}) {
  const keys = useMemo(() =>
    modifier ? [modifier, ...children] : [...children],
  [modifier, children]);

  return (
    <span className={clsx('inline-flex items-center gap-0.5', className)}>
      {keys.map((key) => (
        <span
          key={key}
          className={clsx(
            'px-1 rounded-sm shadow-xs',
            'text-gray-600 bg-gray-200/90',
            'dark:text-gray-300 dark:bg-gray-600/55',
          )}
        >
          {key}
        </span>
      ))}
    </span>
  );
}
