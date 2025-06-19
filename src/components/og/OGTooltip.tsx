import { ComponentProps, ReactNode } from 'react';
import TooltipPrimitive from '../primitives/TooltipPrimitive';
import OGLoaderImage from './OGLoaderImage';

export default function OGTooltip({
  children,
  ...props
}: { children :ReactNode } & ComponentProps<typeof OGLoaderImage>) {
  return (
    <TooltipPrimitive
      content={<OGLoaderImage {...props} />}
    >
      {children}
    </TooltipPrimitive>
  );
}
