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
import { FaChevronRight } from 'react-icons/fa6';
import { MENU_SURFACE_STYLES } from '../primitives/surface';

export type MoreMenuSubmenu = {
  label: string
  labelComplex?: ReactNode
  icon?: ReactNode
} & (
  | { items: ComponentProps<typeof MoreMenuItem>[], sections?: never }
  // Sections render as groups separated by a dividing line
  | { sections: MoreMenuSection[], items?: never }
)

export type MoreMenuSection = {
  label?: string
  items: (ComponentProps<typeof MoreMenuItem> | MoreMenuSubmenu)[]
}

const isSubmenu = (
  item: MoreMenuSection['items'][number],
): item is MoreMenuSubmenu =>
  'items' in item || 'sections' in item;

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
  disabled,
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
  disabled?: boolean
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

  const renderSections = (sections: MoreMenuSection[]) =>
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
            isSubmenu(item)
              ? <DropdownMenu.DropdownMenuSub key={item.label}>
                <DropdownMenu.SubTrigger asChild>
                  <div className="mx-1 focus:outline-none">
                    <div className={clsx(
                      'link outline-none focus:outline-none',
                      'inline-flex w-full items-center h-8.5',
                      'rounded-sm p-2.5',
                      'items-center gap-1.5',
                      'text-sm text-main hover:text-main',
                      'hover:bg-gray-100/90 active:bg-gray-200/75',
                      'dark:hover:bg-gray-800/60 dark:active:bg-gray-900/80',
                      'select-none',
                      'cursor-pointer',
                      'whitespace-nowrap',
                    )}>
                      {item.icon && <div className="w-4.5">
                        {item.icon}
                      </div>}
                      <span className="grow min-w-0 text-left">
                        {item.labelComplex ?? item.label}
                      </span>
                      <FaChevronRight
                        size={11}
                        className="text-dim ml-1"
                      />
                    </div>
                  </div>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent
                    className={MENU_SURFACE_STYLES}
                  >
                    {renderSections(item.sections ?? [{ items: item.items }])}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.DropdownMenuSub>
              : <div key={item.label} className="px-1">
                <MoreMenuItem
                  {...item}
                  dismissMenu={dismissMenu}
                />
              </div>)}
        </div>,
      )}
    </div>;

  return (
    <DropdownMenu.Root
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenu.Trigger asChild {...{ disabled }}>
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
            MENU_SURFACE_STYLES,
            className,
          )}
        >
          {header && <div className={clsx(
            'px-3 pt-3 pb-2 text-dim uppercase',
            'text-sm tracking-wide',
          )}>
            {header}
          </div>}
          {renderSections(sections)}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
