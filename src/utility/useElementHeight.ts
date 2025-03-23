import { useState } from 'react';

import { RefObject, useEffect } from 'react';

export default function useElementHeight(
  element: RefObject<HTMLElement | null>,
) {
  const [height, setHeight] = useState(element.current?.clientHeight);

  useEffect(() => {
    const handleResize = () => setHeight(element.current?.clientHeight);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [element]);

  return height;
}
