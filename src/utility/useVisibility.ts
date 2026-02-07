import { useEffect } from 'react';

export default function useVisibility({
  ref,
  onVisible,
  onHidden,
}: {
  ref: React.RefObject<HTMLElement | null>,
  onVisible?: () => void,
  onHidden?: () => void,
}) {
  useEffect(() => {
    if (ref.current && (onVisible || onHidden)) {
      const observer = new IntersectionObserver(e => {
        if (e[0].isIntersecting) {
          onVisible?.();
        } else {
          onHidden?.();
        }
      }, {
        root: null,
        threshold: 0,
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref, onVisible, onHidden]);
}
