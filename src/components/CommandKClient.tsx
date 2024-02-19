'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import Modal from './Modal';
import { clsx } from 'clsx/lite';
import { useDebounce } from 'use-debounce';
import Spinner from './Spinner';
import { useRouter } from 'next/navigation';

const LISTENER_KEYDOWN = 'keydown';

export default function CommandKClient({
  isLoading,
  onQueryChange,
  sections = [],
}: {
  isLoading?: boolean
  onQueryChange?: (query: string) => void
  sections?: {
    heading: string
    items: {
      label: string
      path: string
    }[]
  }[]
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [queryDebounced] = useDebounce(query, 1000);

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
          <div className="text-sm uppercase text-dim">
            Search for photos, tags, cameras, and film
          </div>
          <div className="relative">
            <Command.Input
              onChangeCapture={(e) => setQuery(e.currentTarget.value)}
              className="w-full !min-w-0"
              style={{ paddingRight: '2rem' }}
            />
            {isLoading &&
              <span className="absolute top-2.5 right-3">
                <Spinner size={16} />
              </span>}
          </div>
          <div
            aria-hidden="true"
            className={clsx(
              'absolute bottom-4 inset-x-0 h-6 z-10 pointer-events-none',
              'bg-gradient-to-t from-white to-transparent',
            )}
          />
          <Command.List className="relative max-h-72 pb-4 overflow-y-scroll">
            <Command.Empty>No results found.</Command.Empty>
            {sections
              .filter(({ items }) => items.length > 0)
              .map(({ heading, items }) =>
                <Command.Group
                  key={heading}
                  heading={heading}
                  className="select-none"
                >
                  {items.map(({ label, path }) =>
                    <Command.Item
                      key={label}
                      className={clsx(
                        'p-1 rounded-md cursor-pointer',
                        'data-[selected=true]:bg-gray-100',
                        'data-[selected=true]:dark:bg-gray-900/75',
                        'data-[active=true]:bg-green-400'
                      )}
                      onSelect={() => {
                        setOpen(false);
                        router.push(path);
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
