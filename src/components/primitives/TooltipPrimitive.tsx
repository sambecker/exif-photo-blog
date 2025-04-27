'use client';

import { ReactNode, useRef, useState, ComponentProps } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import MenuSurface from './MenuSurface';
import useSupportsHover from '@/utility/useSupportsHover';
import clsx from 'clsx/lite';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import KeyCommand from './KeyCommand';
export default function TooltipPrimitive({
  content: contentProp,
  children,
  className,
  classNameTrigger: classNameTriggerProp,
  sideOffset = 10,
  delayDuration = 100,
  skipDelayDuration = 300,
  supportMobile,
  color,
  keyCommand,
  keyCommandModifier,
}: {
  content?: ReactNode
  children: ReactNode
  className?: string
  classNameTrigger?: string
  sideOffset?: number
  delayDuration?: number
  skipDelayDuration?: number
  supportMobile?: boolean
  color?: ComponentProps<typeof MenuSurface>['color']
  keyCommand?: string
  keyCommandModifier?: ComponentProps<typeof KeyCommand>['modifier']
}) {
  const refTrigger = useRef<HTMLButtonElement>(null);
  const refContent = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const supportsHover = useSupportsHover();

  const includeButton = !supportsHover && supportMobile;

  useClickInsideOutside({
    htmlElements: [refTrigger, refContent],
    onClickOutside: () => {
      if (!supportsHover) { setIsOpen(false); }
    },
  });

  const classNameTrigger = clsx(
    'cursor-default inline-flex',
    classNameTriggerProp,
  );

  const content = keyCommand
    ? <div className="-mr-0.5 whitespace-nowrap">
      {contentProp}
      {' '}
      <KeyCommand {...{ modifier: keyCommandModifier }}>
        {keyCommand}
      </KeyCommand>
    </div>
    : contentProp;

  // Blur after clicking to prevent keyboard focus being stuck
  // when tooltip is combined with a button
  const blurActiveElement = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <Tooltip.Provider {...{ delayDuration, skipDelayDuration }}>
      <Tooltip.Root open={includeButton ? isOpen : undefined}>
        <Tooltip.Trigger asChild>
          {includeButton
            ? <button
              ref={refTrigger}
              onClick={() => {
                setIsOpen(!isOpen);
                blurActiveElement();
              }}
              className={clsx('link', classNameTrigger)}
            >
              {children}
            </button>
            : <span
              className={classNameTrigger}
              onClick={blurActiveElement}
            >
              {children}
            </span>}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            ref={refContent}
            sideOffset={sideOffset}
            className={clsx(
              // Entrance animations
              'data-[side=top]:animate-fade-in-from-bottom',
              'data-[side=bottom]:animate-fade-in-from-top',
              // Extra collision padding
              'mx-2',
              // Z-index above
              'z-100',
            )}
          >
            {content &&
              <MenuSurface {...{ color, className }}>
                {content}
              </MenuSurface>}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
