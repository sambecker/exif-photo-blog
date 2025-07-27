import clsx from 'clsx/lite';
import { convertOklchToCss, Oklch } from '.';
import Tooltip from '@/components/Tooltip';

const renderColor = (letter: string, value: number) => (
  <div className="flex gap-2">
    <span className="text-dim">{letter}</span>
    <span>{Math.round(value)}</span>
  </div>
);

export default function ColorDot({ color }: { color: Oklch }) {
  return (
    <Tooltip content={<>
      {renderColor('L', color.l * 100)}
      {renderColor('C', color.c * 100)}
      {renderColor('H', color.h)}
    </>}>
      <div
        className={clsx('size-4 rounded-full outline outline-white/25')}
        style={{ backgroundColor: convertOklchToCss(color) }}
      />
    </Tooltip>
  );
}
