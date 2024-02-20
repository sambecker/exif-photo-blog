'use client';

import { Command } from 'cmdk';
import { ReactNode, useEffect, useState } from 'react';
import Modal from './Modal';
import { clsx } from 'clsx/lite';
import { useDebounce } from 'use-debounce';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

const LISTENER_KEYDOWN = 'keydown';

export type CommandKSection = {
  heading: string
  accessory?: ReactNode
  items: {
    label: string
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [queryDebounced] = useDebounce(query, 1000);

  const [isLoading, setIsLoading] = useState(false);
  const [queriedSections, setQueriedSections] = useState<CommandKSection[]>([]);

  const { setTheme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener(LISTENER_KEYDOWN, down);
    return () => document.removeEventListener(LISTENER_KEYDOWN, down);
  }, []);

  useEffect(() => {
    if (queryDebounced) {
      setIsLoading(true);
      onQueryChange?.(queryDebounced).then(querySections => {
        setQueriedSections(querySections);
        setIsLoading(false);
      });
    }
  }, [queryDebounced, onQueryChange]);

  useEffect(() => {
    if (query === '') {
      setQueriedSections([]);
    }
  }, [query]);

  const sectionTheme: CommandKSection = {
    heading: 'Theme',
    items: [{
      label: 'System',
      action: () => setTheme('system'),
    }, {
      label: 'Light',
      action: () => setTheme('light'),
    }, {
      label: 'Dark',
      action: () => setTheme('dark'),
    }],
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      loop
    >
      <Modal
        anchor='top'
        onClose={() => setOpen(false)}
        fast
      >
        <div className="space-y-1.5">
          <div className="relative">
            <Command.Input
              onChangeCapture={(e) => setQuery(e.currentTarget.value)}
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
            <Command.Empty
              hidden={isLoading}
              className="mt-1 pl-3 text-dim"
            >
              No results found
            </Command.Empty>
            {queriedSections
              .concat(sections)
              .concat(sectionTheme)
              .filter(({ items }) => items.length > 0)
              .map(({ heading, items }) =>
                <Command.Group
                  key={heading}
                  heading={heading}
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
                  {items.map(({ accessory, label, path, action }) =>
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
                        action?.();
                        setOpen(false);
                        if (path) {
                          router.push(path);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {accessory}
                        {label}
                      </div>
                    </Command.Item>)}
                </Command.Group>)}
          </Command.List>
        </div>
      </Modal>
    </Command.Dialog>
  );
}
