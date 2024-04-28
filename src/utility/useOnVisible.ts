import { useEffect } from 'react';

export default function useOnVisible(
  ref: React.RefObject<HTMLElement>,
  onVisible?: () => void
) {
  useEffect(() => {
    if (onVisible && ref.current) {
      const observer = new IntersectionObserver(e => {
        if (e[0].isIntersecting) {
          onVisible();
        }
      }, {
        root: null,
        threshold: 0,
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref, onVisible]);
}
