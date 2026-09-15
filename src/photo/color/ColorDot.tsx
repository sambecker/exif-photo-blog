import clsx from 'clsx/lite';
import { convertOklchToCss, Oklch } from './client';
import Tooltip from '@/components/Tooltip';

const renderColor = (letter: string, value: number, shouldRound?: boolean) => (
  <div className="flex gap-2">
    <span className="text-dim">{letter}</span>
    <span>{shouldRound ? Math.round(value) : value.toFixed(2)}</span>
  </div>
);

export default function ColorDot({
  color,
  title,
  className,
  includeTooltip = true,
  size = 'medium',
}: {
  color?: Oklch | string
  title?: string
  className?: string
  includeTooltip?: boolean
  size?: 'small' | 'medium'
}) {
  const isColorHex = typeof color === 'string';

  const tooltipContent = includeTooltip
    ? color
      ? <>
        {title &&
          <div className="text-dim mb-1 text-left">
            {title}
          </div>}
        {isColorHex
          ? <div>{color}</div>
          : <>
            {renderColor('L', color.l)}
            {renderColor('C', color.c)}
            {renderColor('H', color.h, true)}
          </>}
      </>
      : 'No Color'
    : undefined;

  return (
    <Tooltip content={tooltipContent}>
      <div
        className={clsx(
          size === 'small' ? 'size-2.5' : 'size-4',
          'rounded-full',
          color
            ? 'outline outline-white/25'
            : clsx(
              'flex items-center justify-center overflow-hidden',
              'outline',
              color
                ? 'outline-medium'
                : 'outline-black/50 dark:outline-white/50',
            ),
          className,
        )}
        style={color
          ? { backgroundColor: isColorHex
            ? color
            : convertOklchToCss(color) }
          : undefined}
      >
        {!color &&
          <div className={clsx(
            'w-full h-px rotate-135',
            'bg-black/50 dark:bg-white/50',
          )} />}
      </div>
    </Tooltip>
  );
}
