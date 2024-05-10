'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { AppStateContext } from './AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import usePathnames from '@/utility/usePathnames';
import { getAuthAction } from '@/auth/actions';
import useSWR from 'swr';
import { MATTE_PHOTOS } from '@/site/config';

export default function AppStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const { previousPathname } = usePathnames();

  const [hasLoaded, setHasLoaded] =
    useState(false);
  const [arePhotosMatted, setArePhotosMatted] =
    useState(MATTE_PHOTOS);
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

  const { data } = useSWR('getAuth', getAuthAction);
  useEffect(() => setUserEmail(data?.user?.email ?? undefined), [data]);

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
        arePhotosMatted,
        setArePhotosMatted,
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
