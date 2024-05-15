'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { AppStateContext } from './AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import usePathnames from '@/utility/usePathnames';
import { getAuthAction, logClientAuthUpdate } from '@/auth/actions';
import useSWR from 'swr';
import { MATTE_PHOTOS } from '@/site/config';
import { getPhotosTagHiddenMetaCachedAction } from '@/photo/actions';

export default function AppStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const { previousPathname } = usePathnames();

  // CORE
  const [hasLoaded, setHasLoaded] =
    useState(false);
  const [swrTimestamp, setSwrTimestamp] =
    useState(Date.now());
  const [nextPhotoAnimation, setNextPhotoAnimation] =
    useState<AnimationConfig>();
  const [shouldRespondToKeyboardCommands, setShouldRespondToKeyboardCommands] =
    useState(true);
  const [isCommandKOpen, setIsCommandKOpen] =
    useState(false);
  // ADMIN
  const [userEmail, setUserEmail] =
    useState<string>();
  const [adminUpdateTimes, setAdminUpdateTimes] =
    useState<Date[]>([]);
  const [hiddenPhotosCount, setHiddenPhotosCount] =
    useState(0);
  // DEBUG
  const [arePhotosMatted, setArePhotosMatted] =
    useState(MATTE_PHOTOS);
  const [shouldDebugImageFallbacks, setShouldDebugImageFallbacks] =
    useState(false);
  const [shouldShowBaselineGrid, setShouldShowBaselineGrid] =
    useState(false);

  const invalidateSwr = useCallback(() => setSwrTimestamp(Date.now()), []);

  const { data } = useSWR('getAuth', getAuthAction);
  useEffect(() => {
    setUserEmail(data?.user?.email ?? undefined);
    logClientAuthUpdate(data);
  }, [data]);
  const isUserSignedIn = Boolean(userEmail);
  useEffect(() => {
    if (isUserSignedIn) {
      const timeout = setTimeout(() =>
        getPhotosTagHiddenMetaCachedAction().then(({ count }) =>
          setHiddenPhotosCount(count))
      , 100);
      return () => clearTimeout(timeout);
    } else {
      setHiddenPhotosCount(0);
    }
  }, [isUserSignedIn]);

  const registerAdminUpdate = useCallback(() =>
    setAdminUpdateTimes(updates => [...updates, new Date()])
  , []);

  useEffect(() => {
    setHasLoaded?.(true);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        // CORE
        previousPathname,
        hasLoaded,
        setHasLoaded,
        swrTimestamp,
        invalidateSwr,
        nextPhotoAnimation,
        setNextPhotoAnimation,
        clearNextPhotoAnimation: () => setNextPhotoAnimation?.(undefined),
        shouldRespondToKeyboardCommands,
        setShouldRespondToKeyboardCommands,
        isCommandKOpen,
        setIsCommandKOpen,
        // ADMIN
        userEmail,
        setUserEmail,
        isUserSignedIn,
        adminUpdateTimes,
        registerAdminUpdate,
        hiddenPhotosCount,
        // DEBUG
        arePhotosMatted,
        setArePhotosMatted,
        shouldDebugImageFallbacks,
        setShouldDebugImageFallbacks,
        shouldShowBaselineGrid,
        setShouldShowBaselineGrid,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
