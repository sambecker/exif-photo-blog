import { ComponentProps } from 'react';
import TooltipPrimitive from './primitives/TooltipPrimitive';

export default function Tooltip(
  props: ComponentProps<typeof TooltipPrimitive>,
) {
  return (
    <TooltipPrimitive {...props} />
  );
}
