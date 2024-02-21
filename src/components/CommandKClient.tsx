'use client';

import { Command } from 'cmdk';
import { ReactNode, useEffect, useState } from 'react';
import Modal from './Modal';
import { clsx } from 'clsx/lite';
import { useDebounce } from 'use-debounce';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BiDesktop, BiMoon, BiSun } from 'react-icons/bi';
import { IoInvertModeSharp } from 'react-icons/io5';

const LISTENER_KEYDOWN = 'keydown';
const MINIMUM_QUERY_LENGTH = 2;

export type CommandKSection = {
  heading: string
  accessory?: ReactNode
  items: {
    label: string
    annotation?: ReactNode
    annotationAria?: string
    accessory?: ReactNode
    path?: string
    action?: () => void
  }[]
}

export default function CommandKClient({
  onQueryChange,
  sections = [],
}: {
  onQueryChange?: (query: string) => Promise<CommandKSection[]>
  sections?: CommandKSection[]
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [queryRaw, setQueryRaw] = useState('');
  const [queryDebounced] = useDebounce(queryRaw, 500, { trailing: true });

  const [isLoading, setIsLoading] = useState(false);
  const [queriedSections, setQueriedSections] = useState<CommandKSection[]>([]);

  const { setTheme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener(LISTENER_KEYDOWN, down);
    return () => document.removeEventListener(LISTENER_KEYDOWN, down);
  }, []);

  useEffect(() => {
    if (queryDebounced.length >= MINIMUM_QUERY_LENGTH) {
      setIsLoading(true);
      onQueryChange?.(queryDebounced).then(querySections => {
        setQueriedSections(querySections);
        setIsLoading(false);
      });
    }
  }, [queryDebounced, onQueryChange]);

  useEffect(() => {
    if (queryRaw === '') {
      setQueriedSections([]);
    } else if (queryRaw.length >= MINIMUM_QUERY_LENGTH) {
      setIsLoading(true);
    }
  }, [queryRaw]);

  useEffect(() => {
    if (!isOpen) {
      setQueryRaw('');
      setQueriedSections([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  const sectionTheme: CommandKSection = {
    heading: 'Theme',
    accessory: <IoInvertModeSharp
      size={14}
      className="translate-y-[0.5px] translate-x-[-1px]"
    />,
    items: [{
      label: 'Use System',
      annotation: <BiDesktop />,
      action: () => setTheme('system'),
    }, {
      label: 'Light Mode',
      annotation: <BiSun size={16} className="translate-x-[1.25px]" />,
      action: () => setTheme('light'),
    }, {
      label: 'Dark Mode',
      annotation: <BiMoon className="translate-x-[1px]" />,
      action: () => setTheme('dark'),
    }],
  };

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      label="Global Command Menu"
      filter={(value, search) =>
        value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0}
      loop
    >
      <Modal
        anchor='top'
        onClose={() => setIsOpen(false)}
        fast
      >
        <div className="space-y-1.5">
          <div className="relative">
            <Command.Input
              onChangeCapture={(e) => setQueryRaw(e.currentTarget.value)}
              className={clsx(
                'w-full',
                'focus:ring-0',
                '!border-gray-200 dark:!border-gray-800',
                'focus:border-gray-200 focus:dark:border-gray-800',
                'placeholder:text-gray-400/80',
                'placeholder:dark:text-gray-700',
              )}
              style={{ paddingRight: '2rem' }}
              placeholder="Search photos, views, settings ..."
            />
            {isLoading &&
              <span className="absolute top-2.5 right-3">
                <Spinner size={16} />
              </span>}
          </div>
          <Command.List className="relative max-h-72 overflow-y-scroll">
            <Command.Empty className="mt-1 pl-3 text-dim">
              {isLoading ? 'Loading ...' : 'No results found'}
            </Command.Empty>
            {queriedSections
              .concat(sections)
              .concat(sectionTheme)
              .filter(({ items }) => items.length > 0)
              .map(({ heading, accessory, items }) =>
                <Command.Group
                  key={heading}
                  heading={<div className={clsx(
                    'flex items-center',
                    'px-2',
                  )}>
                    {accessory &&
                      <div className="w-5">{accessory}</div>}
                    {heading}
                  </div>}
                  className={clsx(
                    'uppercase',
                    'select-none',
                    '[&>*:first-child]:py-1',
                    '[&>*:first-child]:font-medium',
                    '[&>*:first-child]:text-dim',
                    '[&>*:first-child]:text-xs',
                    '[&>*:first-child]:tracking-wider',
                  )}
                >
                  {items.map(({
                    accessory,
                    label,
                    annotation,
                    annotationAria,
                    path,
                    action,
                  }) =>
                    <Command.Item
                      key={`${heading}-${label}`}
                      value={`${heading}-${label}`}
                      className={clsx(
                        'px-2',
                        accessory ? 'py-2' : 'py-1',
                        'rounded-md cursor-pointer tracking-wide',
                        'data-[selected=true]:bg-gray-100',
                        'data-[selected=true]:dark:bg-gray-900/75',
                      )}
                      onSelect={() => {
                        setIsOpen(false);
                        action?.();
                        if (path) {
                          router.push(path);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        {accessory}
                        <span className="grow text-ellipsis truncate">
                          {label}
                        </span>
                        {annotation &&
                          <span
                            className="text-dim whitespace-nowrap"
                            aria-label={annotationAria}
                          >
                            <span aria-hidden={Boolean(annotationAria)}>
                              {annotation}
                            </span>
                          </span>}
                      </div>
                    </Command.Item>)}
                </Command.Group>)}
          </Command.List>
        </div>
      </Modal>
    </Command.Dialog>
  );
}
