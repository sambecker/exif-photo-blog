import useKeydownHandler from '@/utility/useKeydownHandler';

export default function useEscapeHandler(
  onKeyDown?: (e: KeyboardEvent) => void,
  ignoreShouldRespondToKeyboardCommands?: boolean,
) {
  useKeydownHandler({
    onKeyDown,
    keys: ['ESCAPE'],
    ignoreShouldRespondToKeyboardCommands,
  });
}
