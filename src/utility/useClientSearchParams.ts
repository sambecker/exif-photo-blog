import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function useClientSearchParams(
  paramKey: string,
): string | undefined {
  const pathname = usePathname();

  const [paramValue, setParamValue] = useState<string>();

  const captureParam = useCallback(() => {
    setParamValue(window.location.search.split(`${paramKey}=`)[1]);
  }, [paramKey]);

  useEffect(() => {
    window.addEventListener('popstate', captureParam);
    window.addEventListener('pushstate', captureParam);
    window.addEventListener('replacestate', captureParam);
    return () => {
      window.removeEventListener('popstate', captureParam);
      window.removeEventListener('pushstate', captureParam);
      window.removeEventListener('replacestate', captureParam);
    };
  }, [captureParam]);

  useEffect(captureParam, [captureParam, pathname]);

  return paramValue;
};
