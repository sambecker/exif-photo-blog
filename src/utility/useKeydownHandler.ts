import { useAppState } from '@/app/AppState';
import { useCallback, useEffect } from 'react';

const LISTENER_KEYDOWN = 'keydown';

export default function useKeydownHandler({
  onKeyDown: onKeyDownArg,
  keys,
  ignoreShouldRespondToKeyboardCommands = false,
}: {
  onKeyDown?: (e: KeyboardEvent) => void
  keys?: string[]
  ignoreShouldRespondToKeyboardCommands?: boolean
}) {
  const { shouldRespondToKeyboardCommands } = useAppState();

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const isKeyValid = (
      !keys ||
      keys.some(key => key.toUpperCase() === e.key?.toUpperCase())
    );
    const isTextEntry = (
      document.activeElement?.tagName === 'INPUT' ||
      document.activeElement?.tagName === 'TEXTAREA'
    );
    if (isKeyValid && !isTextEntry) {
      onKeyDownArg?.(e);
    }
  }, [onKeyDownArg, keys]);

  useEffect(() => {
    if (
      shouldRespondToKeyboardCommands ||
      ignoreShouldRespondToKeyboardCommands
    ) {
      window.addEventListener(LISTENER_KEYDOWN, onKeyDown);
      return () => window.removeEventListener(LISTENER_KEYDOWN, onKeyDown);
    }
  }, [
    shouldRespondToKeyboardCommands,
    ignoreShouldRespondToKeyboardCommands,
    onKeyDown,
  ]);
}
