import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function useOnPathChange(onPathChange: () => void) {
  const path = usePathname();

  const initialPath = useRef(path);

  useEffect(() => {
    if (initialPath.current !== path) {
      onPathChange();
    }
  }, [path, onPathChange]);
}
