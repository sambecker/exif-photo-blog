import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const usePathnames = () => {
  const pathname = usePathname();

  const currentRef = useRef<string>();
  const previousRef = useRef<string>();

  useEffect(() => {
    previousRef.current = currentRef.current;
    currentRef.current = pathname;
  }, [pathname]);

  return {
    currentPathname: currentRef.current,
    previousPathname: previousRef.current,
  };
};

export default usePathnames;