'use client';

import { useState, useEffect, ReactNode } from 'react';
import { AppStateContext } from '.';
import { AnimationConfig } from '@/components/AnimateItems';
import usePathnames from '@/utility/usePathnames';

export default function AppStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const { previousPathname } = usePathnames();

  const [hasLoaded, setHasLoaded] = useState(false);
  
  const [nextPhotoAnimation, setNextPhotoAnimation] =
    useState<AnimationConfig>();

  const [shouldRespondToKeyboardCommands, setShouldRespondToKeyboardCommands] =
    useState(true);

  const [isCommandKOpen, setIsCommandKOpen] = useState(false);

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
        shouldRespondToKeyboardCommands,
        setShouldRespondToKeyboardCommands,
        isCommandKOpen,
        setIsCommandKOpen,
        clearNextPhotoAnimation: () => setNextPhotoAnimation?.(undefined),
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
