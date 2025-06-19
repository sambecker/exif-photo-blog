import { ComponentProps, ReactNode } from 'react';
import TooltipPrimitive from '../primitives/TooltipPrimitive';
import OGLoaderImage from './OGLoaderImage';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import clsx from 'clsx/lite';

export default function OGTooltip({
  children,
  caption,
  ...props
}: {
  children :ReactNode
  caption?: ReactNode
} & ComponentProps<typeof OGLoaderImage>) {
  const { aspectRatio } = IMAGE_OG_DIMENSION;
  return (
    <TooltipPrimitive
      className="max-w-none p-1!"
      classNameTrigger="max-w-full"
      disableHoverableContent
      content={<div
        className="relative"
        style={{ width: 300, aspectRatio }}
      >
        <OGLoaderImage
          {...props}
          className={clsx(
            'overflow-hidden rounded-[0.25rem]',
            'outline-medium bg-dim',
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
      </div>}
    >
      {children}
    </TooltipPrimitive>
  );
}
