'use client';

import { ReactNode, useRef, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import MenuSurface from './MenuSurface';
import useSupportsHover from '@/utility/useSupportsHover';
import clsx from 'clsx/lite';
import useClickInsideOutside from '@/utility/useClickInsideOutside';

export default function TooltipPrimitive({
  content,
  className,
  classNameTrigger: classNameTriggerProp,
  sideOffset = 10,
  supportMobile = true,
  children,
}: {
  content?: ReactNode
  className?: string
  classNameTrigger?: string
  sideOffset?: number
  supportMobile?: boolean
  children: ReactNode
}) {
  const refTrigger = useRef<HTMLButtonElement>(null);
  const refContent = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const supportsHover = useSupportsHover();

  const includeButton = supportMobile && !supportsHover;

  useClickInsideOutside({
    htmlElements: [refTrigger, refContent],
    onClickOutside: () => {
      if (!supportsHover) { setIsOpen(false); }
    },
  });

  const classNameTrigger = clsx(
    'link cursor-default inline-block',
    classNameTriggerProp,
  );

  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root open={!supportsHover ? isOpen : undefined}>
        <Tooltip.Trigger asChild>
          {includeButton
            ? <button
              ref={refTrigger}
              onClick={() => setIsOpen(!isOpen)}
              className={classNameTrigger}
            >
              {children}
            </button>
            : <span className={classNameTrigger}>
              {children}
            </span>}
        </Tooltip.Trigger>
        <Tooltip.Portal >
          <Tooltip.Content
            ref={refContent}
            sideOffset={sideOffset}
            className={clsx(
              // Entrance animations
              'data-[side=top]:animate-fade-in-from-bottom',
              'data-[side=bottom]:animate-fade-in-from-top',
              // Extra collision padding
              'mx-2', 
            )}
          >
            {content &&
              <MenuSurface className={className}>
                {content}
              </MenuSurface>}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
