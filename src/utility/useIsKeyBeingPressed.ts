import { useEffect, useState } from 'react';

const LISTENER_KEYDOWN = 'keydown';
const LISTENER_KEYUP = 'keyup';

export default function useIsKeyBeingPressed(key: string) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        setIsPressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        setIsPressed(false);
      }
    };
    window.addEventListener(LISTENER_KEYDOWN, handleKeyDown);
    window.addEventListener(LISTENER_KEYUP, handleKeyUp);
    return () => {
      window.removeEventListener(LISTENER_KEYDOWN, handleKeyDown);
      window.removeEventListener(LISTENER_KEYUP, handleKeyUp);
    };
  }, [key]);

  return isPressed;
}
