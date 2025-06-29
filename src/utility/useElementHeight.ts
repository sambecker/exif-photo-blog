import { useState, RefObject, useEffect } from 'react';

export default function useElementHeight(
  ref: RefObject<HTMLElement | null>,
) {
  const [height, setHeight] = useState(ref.current?.clientHeight);

  useEffect(() => {
    const handleResize = () => setHeight(ref.current?.clientHeight);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref]);

  return height;
}
