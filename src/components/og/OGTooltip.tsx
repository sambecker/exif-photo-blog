import { ComponentProps, ReactNode } from 'react';
import TooltipPrimitive from '../primitives/TooltipPrimitive';
import OGLoaderImage from './OGLoaderImage';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import clsx from 'clsx/lite';

export default function OGTooltip({
  children,
  ...props
}: { children :ReactNode } & ComponentProps<typeof OGLoaderImage>) {
  const { aspectRatio } = IMAGE_OG_DIMENSION;
  return (
    <TooltipPrimitive
      className="max-w-none"
      content={<div style={{ width: 300, aspectRatio }}>
        <OGLoaderImage
          {...props}
          className={clsx(
            'overflow-hidden rounded-[0.25rem] mx-[-2px]',
            'outline-medium bg-dim',
          )}
        />
      </div>}
    >
      {children}
    </TooltipPrimitive>
  );
}
