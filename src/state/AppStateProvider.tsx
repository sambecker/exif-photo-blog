'use client';

import { useState, useEffect, ReactNode } from 'react';
import { AppStateContext } from '.';
import { AnimationConfig } from '@/components/AnimateItems';
import usePathnames from '@/utility/usePathnames';

export default function StateProvider({
  children,
}: {
  children: ReactNode
}) {
  const { previousPathname } = usePathnames();

  const [hasLoaded, setHasLoaded] = useState(false);
  
  const [nextPhotoAnimation, setNextPhotoAnimation] =
    useState<AnimationConfig>();

  useEffect(() => {
    setHasLoaded?.(true);
  }, [setHasLoaded]);

  return (
    <AppStateContext.Provider
      value={{
        previousPathname,
        hasLoaded,
        setHasLoaded,
        nextPhotoAnimation,
        setNextPhotoAnimation,
        clearNextPhotoAnimation: () => setNextPhotoAnimation?.(undefined),
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
