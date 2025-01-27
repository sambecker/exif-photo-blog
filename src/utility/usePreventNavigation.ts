import { useEffect } from 'react';

export default function usePreventNavigation(
  enabled?: boolean,
  // eslint-disable-next-line max-len
  confirmation = 'Are you sure you want to leave this page? Any unsaved changes will be lost.',
  includeButtons?: boolean,
) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !enabled) return;

    // Handle beforeunload event for browser navigation/refresh
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = confirmation;
      return confirmation;
    };

    // Handle client-side navigation
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | undefined;
      const parent = target?.parentElement as HTMLElement | undefined;
      const grandParent = parent?.parentElement as HTMLElement | undefined;
      const targets = [target, parent, grandParent];
      if (
        targets.some(target => target?.tagName === 'A') && (
          !includeButtons ||
          targets.some(target => target?.tagName === 'BUTTON')
        )
      ) {
        if (!window.confirm(confirmation)) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    document.addEventListener('click', clickHandler, true);
    
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      document.removeEventListener('click', clickHandler, true);
    };
  }, [enabled, confirmation, includeButtons]);
}
