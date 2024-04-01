import { useEffect, useState } from 'react';

export default function useDelay(delay = 0) {
  const [didLoad, setDidLoad] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setDidLoad(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return didLoad;
};
