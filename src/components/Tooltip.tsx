import { ComponentProps, ReactNode } from 'react';
import TooltipPrimitive from './primitives/TooltipPrimitive';
import { IoInformationCircleOutline } from 'react-icons/io5';

export default function Tooltip({
  children,
  ...rest
}: Omit<ComponentProps<typeof TooltipPrimitive>, 'children'> & {
  children?: ReactNode
}) {
  return (
    <TooltipPrimitive {...rest}>
      {children ?? <IoInformationCircleOutline size={18} />}
    </TooltipPrimitive>
  );
}
