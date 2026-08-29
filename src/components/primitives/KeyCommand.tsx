import clsx from 'clsx/lite';
import { useMemo } from 'react';
import { GrReturn } from 'react-icons/gr';
import { PiBackspaceBold, PiCommandBold } from 'react-icons/pi';
import useIsApplePlatform from '@/utility/useIsApplePlatform';

export default function KeyCommand({
  children,
  modifier,
  className,
}: {
  children: string
  modifier?: '⌘' | '⌥' | '⇧' | '⌃' | '⏎'
  className?: string
}) {
  const isApplePlatform = useIsApplePlatform();

  const keys = useMemo(() => {
    const childrenFormatted = children === 'BACKSPACE'
      ? '⌫'
      : children;
    return modifier ? [modifier, ...childrenFormatted] : [...childrenFormatted];
  }, [modifier, children]);

  return (
    <span className={clsx('inline-flex items-center gap-0.5', className)}>
      {keys.map((key) => (
        <span
          key={key}
          className={clsx(
            'inline-flex items-center justify-center',
            'px-1 h-4 rounded-sm text-xs font-medium',
            'text-gray-500/90 bg-gray-200/70',
            'dark:text-gray-300/90 dark:bg-gray-600/50',
          )}
        >
          {key === '⌘'
            ? isApplePlatform
              ? <PiCommandBold />
              : <span className="font-semibold text-[10px] px-0.5">^</span>
            : key === '⏎'
              ? <GrReturn size={14} />
              : key === '⌫'
                ? <PiBackspaceBold size={14} />
                : key}
        </span>
      ))}
    </span>
  );
}
