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
        // Occupy a baseline row so vertical rhythm matches adjacent EXIF lines
        'inline-flex items-center w-fit h-baseline',
        className,
      )}
    >
      <div className="inline-flex h-[5px] overflow-hidden">
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
      </div>
    </div>
  );
}
