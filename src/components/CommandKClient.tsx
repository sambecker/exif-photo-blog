'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import Modal from './Modal';
import { clsx } from 'clsx/lite';
import { useDebounce } from 'use-debounce';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

const LISTENER_KEYDOWN = 'keydown';

export type CommandKSection = {
  heading: string
  items: {
    label: string
    path?: string
    action?: () => void
  }[]
}

export default function CommandKClient({
  isLoading,
  onQueryChange,
  sections = [],
}: {
  isLoading?: boolean
  onQueryChange?: (query: string) => void
  sections?: CommandKSection[]
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [queryDebounced] = useDebounce(query, 1000);

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
      onQueryChange?.(queryDebounced);
    }
  }, [queryDebounced, onQueryChange]);

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
    >
      <Modal
        anchor='top'
        onClose={() => setOpen(false)}
        fast
      >
        <div className="space-y-3">
          <div className="relative">
            <Command.Input
              onChangeCapture={(e) => setQuery(e.currentTarget.value)}
              className={clsx(
                'w-full',
                'placeholder:text-gray-400',
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
            <Command.Empty>No results found.</Command.Empty>
            {sections
              .concat(sectionTheme)
              .filter(({ items }) => items.length > 0)
              .map(({ heading, items }) =>
                <Command.Group
                  key={heading}
                  heading={heading}
                  className={clsx(
                    'uppercase',
                    'select-none',
                    '[&>*:first-child]:py-1.5',
                    '[&>*:first-child]:font-medium',
                    '[&>*:first-child]:text-dim',
                    '[&>*:first-child]:text-xs',
                    '[&>*:first-child]:tracking-wider',
                  )}
                >
                  {items.map(({ label, path, action }) =>
                    <Command.Item
                      key={`${heading}-${label}`}
                      className={clsx(
                        'py-1 px-2 rounded-md cursor-pointer',
                        'data-[selected=true]:bg-gray-100',
                        'data-[selected=true]:dark:bg-gray-900/75',
                        'data-[active=true]:bg-green-400'
                      )}
                      onSelect={() => {
                        action?.();
                        setOpen(false);
                        if (path) {
                          router.push(path);
                        }
                      }}
                    >
                      {label}
                    </Command.Item>)}
                </Command.Group>)}
          </Command.List>
        </div>
      </Modal>
    </Command.Dialog>
  );
}
