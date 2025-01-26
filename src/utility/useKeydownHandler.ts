import { useAppState } from '@/state/AppState';
import { useCallback, useEffect } from 'react';

const LISTENER_KEYDOWN = 'keydown';

export default function useKeydownHandler(
  onKeydown?: (e: KeyboardEvent) => void,
  keys: string[] = [],
  ignoreShouldRespondToKeyboardCommands?: boolean,
) {
  const { shouldRespondToKeyboardCommands } = useAppState();

  const onKeyUp = useCallback((e: KeyboardEvent) => {
    if (keys.some(key => key.toUpperCase() === e.key?.toUpperCase())) {
      onKeydown?.(e);
    }
  }, [onKeydown, keys]);

  useEffect(() => {
    if (
      shouldRespondToKeyboardCommands ||
      ignoreShouldRespondToKeyboardCommands
    ) {
      window.addEventListener(LISTENER_KEYDOWN, onKeyUp);
      return () => window.removeEventListener(LISTENER_KEYDOWN, onKeyUp);
    }
  }, [
    shouldRespondToKeyboardCommands,
    ignoreShouldRespondToKeyboardCommands,
    onKeyUp,
  ]);
}
