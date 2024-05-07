'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { AppStateContext } from './AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import usePathnames from '@/utility/usePathnames';
import { getCurrentUser } from '@/auth/actions';
import useSWR from 'swr';

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
  const [adminUpdateTimes, setAdminUpdateTimes] = useState<Date[]>([]);
  const [shouldShowBaselineGrid, setShouldShowBaselineGrid] =
    useState(false);
  const [shouldDebugBlur, setShouldDebugBlur] =
    useState(false);

  const invalidateSwr = useCallback(() => setSwrTimestamp(Date.now()), []);

  const { data } = useSWR('getCurrentUser', getCurrentUser);
  useEffect(() => setUserEmail(data?.email ?? undefined), [data]);

  const registerAdminUpdate = useCallback(() =>
    setAdminUpdateTimes(updates => [...updates, new Date()])
  , []);

  useEffect(() => {
    setHasLoaded?.(true);
  }, []);

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
        adminUpdateTimes,
        registerAdminUpdate,
        shouldShowBaselineGrid,
        shouldDebugBlur,
        setShouldDebugBlur,
        setShouldShowBaselineGrid,
        clearNextPhotoAnimation: () => setNextPhotoAnimation?.(undefined),
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
