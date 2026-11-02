import { useCallback, useEffect, useRef } from 'react';

const whenDocumentVisible = () => new Promise<void>(resolve => {
  if (!document.hidden) {
    resolve();
  } else {
    const onChange = () => {
      if (!document.hidden) {
        document.removeEventListener('visibilitychange', onChange);
        resolve();
      }
    };
    document.addEventListener('visibilitychange', onChange);
  }
});

export default function useDocumentVisibility(isTracking = true) {
  const wasHidden = useRef(false);

  useEffect(() => {
    if (!isTracking) { return; }
    const checkHidden = () => {
      if (document.hidden) { wasHidden.current = true; }
    };
    checkHidden();
    document.addEventListener('visibilitychange', checkHidden);
    return () => document.removeEventListener('visibilitychange', checkHidden);
  }, [isTracking]);

  // True if the document is hidden now, or was at any point while tracking
  const hasDocumentBeenHidden = useCallback(() =>
    document.hidden || wasHidden.current, []);

  return {
    hasDocumentBeenHidden,
    whenDocumentVisible,
  };
}
