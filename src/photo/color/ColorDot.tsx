import clsx from 'clsx/lite';
import { convertOklchToCss, logOklch, Oklch } from '.';

export default function ColorDot({ color }: { color: Oklch }) {
  return (
    <div
      title={logOklch(color)}
      className={clsx(
        'size-4 rounded-full',
        'outline outline-white/25',
      )}
      style={{ backgroundColor: convertOklchToCss(color) }}
    />
  );
}
