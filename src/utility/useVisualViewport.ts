import { useState } from 'react';

import { useEffect } from 'react';

export default function useVisualViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState<number>();

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.visualViewport?.height);
    };
    window.visualViewport?.addEventListener('resize', handleResize);
    return () =>
      window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  return viewportHeight;
}
