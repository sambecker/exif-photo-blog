'use client';

import { getEscapePath } from '@/site/paths';
import { useAppState } from '@/state/AppState';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const LISTENER_KEYUP = 'keyup';

export default function PhotoEscapeHandler() {
  const router = useRouter();
 
  const pathname = usePathname();

  const { shouldRespondToKeyboardCommands } = useAppState();

  const escapePath = getEscapePath(pathname);

  useEffect(() => {
    if (shouldRespondToKeyboardCommands) {
      const onKeyUp = (e: KeyboardEvent) => {
        //PhotoEscapeHandler.tsx:22 Uncaught TypeError: Cannot read properties of undefined (reading 'toUpperCase')
        if(!e?.key) return
        if (e.key.toUpperCase() === 'ESCAPE' && escapePath) {
          router.push(escapePath, { scroll: false });
        };
      };
      window.addEventListener(LISTENER_KEYUP, onKeyUp);
      return () => window.removeEventListener(LISTENER_KEYUP, onKeyUp);
    }
  }, [shouldRespondToKeyboardCommands, router, escapePath]);

  return null;
}
