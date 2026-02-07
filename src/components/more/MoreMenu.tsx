import {
  ComponentProps,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { FiMoreHorizontal } from 'react-icons/fi';
import MoreMenuItem from './MoreMenuItem';
import { clearGlobalFocus } from '@/utility/dom';

export type MoreMenuSection = {
  label?: string
  items: ComponentProps<typeof MoreMenuItem>[]
}

export default function MoreMenu({
  sections,
  icon,
  header,
  className,
  classNameButton,
  classNameButtonOpen,
  ariaLabel,
  align = 'end',
  // Prevent errant clicks from trigger being too close to menu
  sideOffset = 6,
  isOpen: isOpenProp,
  setIsOpen: setIsOpenProp,
  onOpen,
  ...props
}: {
  sections: MoreMenuSection[]
  icon?: ReactNode
  header?: ReactNode
  className?: string
  classNameButton?: string
  classNameButtonOpen?: string
  ariaLabel: string
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
  onOpen?: () => void
} & ComponentProps<typeof DropdownMenu.Content>){
  const [isOpenInternal, setIsOpenInternal] = useState(isOpenProp ?? false);

  const isOpen = isOpenProp ?? isOpenInternal;
  const setIsOpen = setIsOpenProp ?? setIsOpenInternal;

  const dismissMenu = useCallback(() => {
    setIsOpen(false);
    clearGlobalFocus();
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) { onOpen?.(); }
  }, [isOpen, onOpen]);

  return (
    <DropdownMenu.Root
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={clsx(
            'px-1 py-[3px]',
            'min-h-0 border-none shadow-none',
            'hover:bg-gray-100 active:bg-gray-200/75',
            'dark:hover:bg-gray-800/75 dark:active:bg-gray-900',
            'text-dim',
            'outline-none',
            classNameButton,
            isOpen && 'bg-dim',
            isOpen && classNameButtonOpen,
          )}
          aria-label={ariaLabel}
        >
          {icon ?? <FiMoreHorizontal size={18} />}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          {...props}
          onCloseAutoFocus={e => e.preventDefault()}
          align={align}
          sideOffset={sideOffset}
          className={clsx(
            'z-10',
            'min-w-[8rem]',
            'component-surface',
            'py-1',
            'not-dark:shadow-lg not-dark:shadow-gray-900/10',
            'data-[side=top]:dark:shadow-[0_0px_40px_rgba(0,0,0,0.6)]',
            'data-[side=bottom]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
            'data-[side=right]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
            'data-[side=top]:animate-fade-in-from-bottom',
            'data-[side=bottom]:animate-fade-in-from-top',
            'data-[side=right]:animate-fade-in-from-top',
            className,
          )}
        >
          {header && <div className={clsx(
            'px-3 pt-3 pb-2 text-dim uppercase',
            'text-sm tracking-wide',
          )}>
            {header}
          </div>}
          <div className="divide-y divide-medium">
            {sections.map(({ label, items }, index) =>
              <div
                key={index}
                className={clsx(
                  '[&:not(:first-child)]:pt-1',
                  '[&:not(:last-child)]:pb-1',
                )}
              >
                {label && <div className={clsx(
                  'px-3.5 pt-1.5 pb-0.5 select-none',
                  'text-extra-dim uppercase text-xs font-medium tracking-wide',
                )}>
                  {label}
                </div>}
                {items.map(item =>
                  <div key={item.label} className="px-1">
                    <MoreMenuItem
                      {...item}
                      dismissMenu={dismissMenu}
                    />
                  </div>,
                )}
              </div>,
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
