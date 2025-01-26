import useKeydownHandler from '@/utility/useKeydownHandler';

export default function useEscapeHandler(
  onEscape?: () => void,
  ignoreShouldRespondToKeyboardCommands?: boolean,
) {
  useKeydownHandler(
    onEscape,
    ['ESCAPE'],
    ignoreShouldRespondToKeyboardCommands,
  );
}
