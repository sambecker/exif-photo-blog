import { ComponentProps, ReactNode, useRef, useEffect } from 'react';
import OGLoaderImage from './OGLoaderImage';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import clsx from 'clsx/lite';
import { Tooltip, useOGTooltipState } from './state';
import useSupportsHover from '@/utility/useSupportsHover';

const { aspectRatio } = IMAGE_OG_DIMENSION;

const width = 300;
const height = width / aspectRatio;
const offsetAbove = -1;
const offsetBelow = -6;

export default function OGTooltip({
  children,
  caption,
  color,
  ...props
}: {
  children :ReactNode
  caption?: ReactNode
  color?: Tooltip['color']
} & ComponentProps<typeof OGLoaderImage>) {
  const ref = useRef<HTMLDivElement>(null);

  const { showTooltip, dismissTooltip } = useOGTooltipState();

  const supportsHover = useSupportsHover();

  useEffect(() => {
    const trigger = ref.current;
    return () => dismissTooltip?.(trigger);
  }, [dismissTooltip]);

  const content =
    <div
      className="relative"
      style={{ width, height }}
    >
      <OGLoaderImage
        {...props}
        className={clsx(
          'overflow-hidden rounded-[0.25rem]',
          color === 'frosted'
            ? 'outline outline-gray-400/25'
            : 'outline-medium bg-extra-dim',
        )}
      />
      {caption && <div className={clsx(
        'absolute left-3 bottom-3',
        'px-1.5 py-0.5 rounded-md',
        'text-white/90 bg-black/40 backdrop-blur-lg',
        'outline-medium shadow-sm',
        'uppercase text-xs',
      )}>
        {caption}
      </div>}
    </div>;

  return (
    <div
      className="max-w-full"
      ref={ref}
      onMouseEnter={() => supportsHover &&
        showTooltip?.(
          ref.current,
          { content, width, height, offsetAbove, offsetBelow, color },
        )}
      onMouseLeave={() => supportsHover &&
        dismissTooltip?.(ref.current)}
    >
      {children}
    </div>
  );
}
