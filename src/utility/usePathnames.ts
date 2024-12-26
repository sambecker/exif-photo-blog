import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const usePathnames = () => {
  const pathname = usePathname();

  const currentRef = useRef('');
  const previousRef = useRef('');

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