import { useEffect } from 'react';

export default function usePreventNavigation(
  enabled?: boolean,
  // eslint-disable-next-line max-len
  confirmation = 'Are you sure you want to leave this page? Any unsaved changes will be lost.',
  includeButtons?: boolean,
) {
  useEffect(() => {
    const callback = (e: MouseEvent) => {
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
        if (enabled && !confirm(confirmation)) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    };
    document.addEventListener('click', callback, true);
    return () => document.removeEventListener('click', callback, true);
  }, [enabled, confirmation, includeButtons]);
}
