import { RefObject, useState } from 'react';
import useVisibility from './useVisibility';

export default function useIsVisible({
  ref,
  initiallyVisible = false,
}: {
  ref: RefObject<HTMLElement | null>
  initiallyVisible?: boolean
}) {
  const [isVisible, setIsVisible] = useState(initiallyVisible);

  useVisibility({
    ref,
    onVisible: () => setIsVisible(true),
    onHidden: () => setIsVisible(false),
  });

  return isVisible;
}
