'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { AppStateContext } from './AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import usePathnames from '@/utility/usePathnames';
import { getCurrentUser } from '@/auth/actions';

export default function AppStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const { previousPathname } = usePathnames();

  const [hasLoaded, setHasLoaded] =
    useState(false);
  const [swrTimestamp, setSwrTimestamp] =
    useState(Date.now());
  const [userEmail, setUserEmail] =
    useState<string>();
  const [nextPhotoAnimation, setNextPhotoAnimation] =
    useState<AnimationConfig>();
  const [shouldRespondToKeyboardCommands, setShouldRespondToKeyboardCommands] =
    useState(true);
  const [isCommandKOpen, setIsCommandKOpen] =
    useState(false);
  const [shouldShowBaselineGrid, setShouldShowBaselineGrid] =
    useState(false);

  const invalidateSwr = useCallback(() => setSwrTimestamp(Date.now()), []);

  const captureUser = useCallback(() =>
    getCurrentUser().then(user => setUserEmail?.(user?.email ?? undefined))
  , []);

  useEffect(() => {
    setHasLoaded?.(true);
    captureUser().catch(() => setTimeout(captureUser, 2000));
  }, [captureUser]);

  return (
    <AppStateContext.Provider
      value={{
        previousPathname,
        hasLoaded,
        swrTimestamp,
        invalidateSwr,
        setHasLoaded,
        isUserSignedIn: userEmail !== undefined,
        userEmail,
        setUserEmail,
        nextPhotoAnimation,
        setNextPhotoAnimation,
        shouldRespondToKeyboardCommands,
        setShouldRespondToKeyboardCommands,
        isCommandKOpen,
        setIsCommandKOpen,
        shouldShowBaselineGrid,
        setShouldShowBaselineGrid,
        clearNextPhotoAnimation: () => setNextPhotoAnimation?.(undefined),
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
