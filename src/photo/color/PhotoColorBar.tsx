import { clsx } from 'clsx/lite';
import {
  convertOklchToCss,
  PhotoColorData,
} from './client';

export default function PhotoColorBar({
  colorData,
  className,
}: {
  colorData?: PhotoColorData
  className?: string
}) {
  if (!colorData) { return null; }

  // Main/AI color, then up to 5 palette colors
  const main = colorData.ai ?? colorData.colors[0];
  if (!main) { return null; }

  const swatches = colorData.ai
    ? colorData.colors.slice(0, 5)
    : colorData.colors.slice(1, 6);

  return (
    <div
      className={clsx(
        // w-fit: hug swatches without stretching; parent items-end can still
        // right-align when meta is on the left
        'relative inline-flex w-fit',
        'h-2.5 overflow-hidden rounded-[4px]',
        className,
      )}
    >
      <div
        className="w-[50px] shrink-0 h-full"
        style={{ backgroundColor: convertOklchToCss(main) }}
        title="Main"
      />
      {swatches.map((color, index) =>
        <div
          key={index}
          className="w-[6px] shrink-0 h-full"
          style={{ backgroundColor: convertOklchToCss(color) }}
          title={`Color ${index + 1}`}
        />)}
      {/* Inner stroke — matches ColorDot light/dark definition */}
      <div
        className={clsx(
          'absolute inset-px rounded-[4px]',
          'outline outline-black/10 dark:outline-white/20',
          'pointer-events-none',
        )}
      />
    </div>
  );
}
