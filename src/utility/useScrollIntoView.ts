import { RefObject, useEffect } from 'react';
import { isElementEntirelyInViewport } from '@/utility/dom';

export default function useScrollIntoView({
  ref,
  shouldScrollIntoView,
}: {
  ref?: RefObject<HTMLElement | null>
  shouldScrollIntoView?: boolean
}) {
  useEffect(() => {
    if (
      ref?.current &&
      !isElementEntirelyInViewport(ref.current) &&
      shouldScrollIntoView
    ) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref, shouldScrollIntoView]);
}
