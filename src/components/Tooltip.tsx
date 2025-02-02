import { ReactNode } from 'react';
import TooltipPrimitive from './primitives/TooltipPrimitive';

export default function Tooltip({
  children,
  content,
  className,
}: {
  children: ReactNode
  content?: ReactNode
  className?: string
}) {
  return (
    <TooltipPrimitive {...{ content, className }} >
      {children}
    </TooltipPrimitive>
  );
}
