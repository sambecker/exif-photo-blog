'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import Modal from './Modal';
import { clsx } from 'clsx/lite';

const LISTENER_KEYDOWN = 'keydown';

export default function CommandK() {
  const [open, setOpen] = useState(false);

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

  const renderItem = (item: string) =>
    <Command.Item className={clsx(
      'p-1 rounded-md',
      'data-[selected=true]:bg-blue-50',
    )}>
      {item}
    </Command.Item>;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
    >
      <Modal onClose={() => setOpen(false)} fast>
        <Command.Input className="w-full" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Letters">
            {renderItem('a')}
            {renderItem('b')}
            <Command.Separator />
            {renderItem('c')}
          </Command.Group>

          {renderItem('Apple')}
        </Command.List>
      </Modal>
    </Command.Dialog>
  );
}
