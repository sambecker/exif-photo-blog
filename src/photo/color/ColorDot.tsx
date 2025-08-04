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
}: {
  color: Oklch | string
  title?: string
  className?: string
  includeTooltip?: boolean
}) {
  const isColorHex = typeof color === 'string';
  return (
    <Tooltip content={includeTooltip && <>
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
    </>}>
      <div
        className={clsx(
          'size-4 rounded-full outline outline-white/25',
          className,
        )}
        style={{ backgroundColor: isColorHex
          ? color 
          : convertOklchToCss(color) }}
      />
    </Tooltip>
  );
}
