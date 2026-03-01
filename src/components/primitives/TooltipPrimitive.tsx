'use client';

import { ReactNode, useRef, useState, ComponentProps } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import ComponentSurface from './surface/ComponentSurface';
import clsx from 'clsx/lite';
import useClickInsideOutside from '@/utility/useClickInsideOutside';
import KeyCommand from './KeyCommand';
import { clearGlobalFocus } from '@/utility/dom';
import { useAppState } from '@/app/AppState';

export default function TooltipPrimitive({
  content: contentProp,
  children,
  className,
  classNameTrigger: classNameTriggerProp,
  color,
  keyCommand,
  keyCommandModifier,
  supportMobile,
  animateLarge,
  disableHoverableContent,
  delayDuration = 100,
  skipDelayDuration = 300,
  align,
  side,
  sideOffset = 10,
  debug,
}: {
  content?: ReactNode
  children: ReactNode
  className?: string
  classNameTrigger?: string
  color?: ComponentProps<typeof ComponentSurface>['color']
  keyCommand?: string
  keyCommandModifier?: ComponentProps<typeof KeyCommand>['modifier']
  supportMobile?: boolean
  animateLarge?: boolean
  disableHoverableContent?: boolean
  // Tooltip.Provider
  delayDuration?: number
  skipDelayDuration?: number
  // Tooltip.Content
  align?: ComponentProps<typeof Tooltip.Content>['align']
  side?: ComponentProps<typeof Tooltip.Content>['side']
  sideOffset?: number
  debug?: boolean
}) {
  const refTrigger = useRef<HTMLButtonElement>(null);
  const refContent = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const { supportsHover } = useAppState();

  const includeButton = supportMobile && supportsHover === false;

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

  return (
    <Tooltip.Provider {...{ delayDuration, skipDelayDuration }}>
      <Tooltip.Root
        open={(includeButton ? isOpen : undefined) || debug}
        disableHoverableContent={disableHoverableContent}
      >
        <Tooltip.Trigger asChild>
          {includeButton
            ? <button
              ref={refTrigger}
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                // Blur after clicking to prevent keyboard focus being stuck
                // when tooltip is combined with a button
                clearGlobalFocus();
              }}
              className={clsx('link', classNameTrigger)}
            >
              {children}
            </button>
            : <span
              className={classNameTrigger}
              onClick={clearGlobalFocus}
            >
              {children}
            </span>}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            ref={refContent}
            align={align}
            side={side}
            sideOffset={sideOffset}
            className={clsx(
              // Entrance animations
              animateLarge
                ? 'data-[side=top]:animate-fade-in-from-bottom-large'
                : 'data-[side=top]:animate-fade-in-from-bottom',
              animateLarge
                ? 'data-[side=bottom]:animate-fade-in-from-top-large'
                : 'data-[side=bottom]:animate-fade-in-from-top',
              // Extra collision padding
              'mx-2',
              // Z-index above
              'z-100',
            )}
          >
            {content &&
              <ComponentSurface {...{ color, className }}>
                {content}
              </ComponentSurface>}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
