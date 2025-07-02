import { ComponentProps, ReactNode } from 'react';
import OGLoaderImage from './OGLoaderImage';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import clsx from 'clsx/lite';
import { SharedHoverData } from '../shared-hover/state';
import SharedHover from '../shared-hover/SharedHover';

const { aspectRatio } = IMAGE_OG_DIMENSION;

const width = 300;
const height = width / aspectRatio;

export default function OGHover({
  children,
  caption,
  color,
  ...props
}: {
  children :ReactNode
  caption?: ReactNode
  color?: SharedHoverData['color']
} & ComponentProps<typeof OGLoaderImage>) {
  return (
    <SharedHover
      hoverKey={props.title}
      color={color}
      width={width}
      height={height}
      classNameContent="relative"
      content={<>
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
      </>}
    >
      {children}
    </SharedHover>
  );
}
