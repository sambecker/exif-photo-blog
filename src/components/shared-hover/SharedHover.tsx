import { ReactNode, useRef, useEffect } from 'react';
import { SharedHoverData, useSharedHoverState } from '../shared-hover/state';
import useSupportsHover from '@/utility/useSupportsHover';

export default function SharedHover({
  hoverKey: key,
  children,
  content,
  classNameContent,
  width,
  height,
  offsetAbove = -1,
  offsetBelow = -6,
  color,
}: {
  hoverKey: string
  children :ReactNode
  content: ReactNode
  classNameContent?: string
  width: number
  height: number
  offsetAbove?: number
  offsetBelow?: number
  color?: SharedHoverData['color']
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { showHover, dismissHover } = useSharedHoverState();

  const supportsHover = useSupportsHover();

  useEffect(() => {
    const trigger = ref.current;
    return () => dismissHover?.(trigger);
  }, [dismissHover]);

  return (
    <div
      className="max-w-full"
      ref={ref}
      onMouseEnter={() => supportsHover &&
        showHover?.(
          ref.current,
          {
            key,
            content,
            className: classNameContent,
            width,
            height,
            offsetAbove,
            offsetBelow,
            color,
          },
        )}
      onMouseLeave={() => supportsHover &&
        dismissHover?.(ref.current)}
    >
      {children}
    </div>
  );
}
