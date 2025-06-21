import { ComponentProps, ReactNode, useRef, useEffect } from 'react';
import OGLoaderImage from './OGLoaderImage';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import clsx from 'clsx/lite';
import { useOGTooltipState } from './state';

export default function OGTooltip({
  children,
  caption,
  ...props
}: {
  children :ReactNode
  caption?: ReactNode
} & ComponentProps<typeof OGLoaderImage>) {
  const ref = useRef<HTMLDivElement>(null);

  const { showTooltip, dismissTooltip } = useOGTooltipState();

  // const supportsHover = useSupportsHover();
  
  const { aspectRatio } = IMAGE_OG_DIMENSION;
  const width = 300;
  const height = width / aspectRatio;

  useEffect(() => {
    const element = ref.current;
    return () => dismissTooltip?.(element);
  }, [dismissTooltip]);

  const tile =
    <div
      className="relative"
      style={{ width, height }}
    >
      <OGLoaderImage
        {...props}
        className={clsx(
          'overflow-hidden rounded-[0.25rem]',
          'outline-medium bg-extra-dim',
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
      onMouseEnter={() => showTooltip?.(ref.current, tile)}
      onMouseLeave={() => dismissTooltip?.(ref.current)}
    >
      {children}
    </div>
  );
}
