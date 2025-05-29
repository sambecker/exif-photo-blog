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
  sections: ComponentProps<typeof MoreMenuItem>[][]
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
          className={clsx(
            'px-1 py-[3px]',
            'min-h-0 border-none shadow-none',
            'hover:bg-gray-100 active:bg-gray-200/75',
            'dark:hover:bg-gray-800/75 dark:active:bg-gray-900',
            'text-dim',
            'outline-none',
            classNameButton,
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
            'shadow-lg shadow-gray-900/10 dark:shadow-900',
            'data-[side=top]:dark:shadow-[0_0px_40px_rgba(0,0,0,0.6)]',
            'data-[side=bottom]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
            'data-[side=top]:animate-fade-in-from-bottom',
            'data-[side=bottom]:animate-fade-in-from-top',
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
            {sections.map((section, index) =>
              <div
                key={index}
                className={clsx(
                  '[&:not(:first-child)]:pt-1',
                  '[&:not(:last-child)]:pb-1',
                )}
              >
                {section.map(props =>
                  <div key={props.label} className="px-1">
                    <MoreMenuItem
                      dismissMenu={dismissMenu}
                      {...props}
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
