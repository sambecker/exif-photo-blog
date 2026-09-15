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
          size === 'small' ? 'size-3' : 'size-4',
          'rounded-full',
          color
            ? 'outline outline-white/25'
            : clsx(
              'flex items-center justify-center',
              'outline outline-gray-400/50 dark:outline-gray-500/50',
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
          <div className="size-[40%] rounded-full bg-medium" />}
      </div>
    </Tooltip>
  );
}
