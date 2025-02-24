'use client';

import { useState, useEffect, ReactNode, useCallback } from 'react';
import { AppStateContext } from './AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import usePathnames from '@/utility/usePathnames';
import { getAuthAction } from '@/auth/actions';
import useSWR from 'swr';
import {
  HIGH_DENSITY_GRID,
  IS_DEVELOPMENT,
  MATTE_PHOTOS,
  SHOW_ZOOM_CONTROLS,
} from '@/app/config';
import { getPhotosHiddenMetaCachedAction } from '@/photo/actions';
import { ShareModalProps } from '@/share';
import { storeTimezoneCookie } from '@/utility/timezone';
import { getShouldShowInsightsIndicatorAction } from '@/admin/insights/actions';
import { InsightIndicatorStatus } from '@/admin/insights';

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
  // MODAL
  const [isCommandKOpen, setIsCommandKOpen] =
    useState(false);
  const [shareModalProps, setShareModalProps] =
    useState<ShareModalProps>();
  // ADMIN
  const [userEmail, setUserEmail] =
    useState<string>();
  const [adminUpdateTimes, setAdminUpdateTimes] =
    useState<Date[]>([]);
  const [hiddenPhotosCount, setHiddenPhotosCount] =
    useState(0);
  const [selectedPhotoIds, setSelectedPhotoIds] =
    useState<string[] | undefined>();
  const [isPerformingSelectEdit, setIsPerformingSelectEdit] =
    useState(false);
  const [insightIndicatorStatus, setInsightIndicatorStatus] =
    useState<InsightIndicatorStatus>();
  // DEBUG
  const [isGridHighDensity, setIsGridHighDensity] =
    useState(HIGH_DENSITY_GRID);
  const [areZoomControlsShown, setAreZoomControlsShown] =
    useState(SHOW_ZOOM_CONTROLS);
  const [arePhotosMatted, setArePhotosMatted] =
    useState(MATTE_PHOTOS);
  const [shouldDebugImageFallbacks, setShouldDebugImageFallbacks] =
    useState(false);
  const [shouldShowBaselineGrid, setShouldShowBaselineGrid] =
    useState(false);
  const [shouldDebugInsights, setShouldDebugInsights] =
    useState(IS_DEVELOPMENT);
  const [shouldDebugRecipeOverlays, setShouldDebugRecipeOverlays] =
    useState(false);

  const invalidateSwr = useCallback(() => setSwrTimestamp(Date.now()), []);

  const { data, error } = useSWR('getAuth', getAuthAction);
  useEffect(() => {
    if (!error) {
      setUserEmail(data?.user?.email ?? undefined);
    }
  }, [data, error]);
  const isUserSignedIn = Boolean(userEmail);
  useEffect(() => {
    if (isUserSignedIn) {
      const timeout = setTimeout(() =>{
        getPhotosHiddenMetaCachedAction()
          .then(({ count }) => setHiddenPhotosCount(count));
        getShouldShowInsightsIndicatorAction()
          .then(setInsightIndicatorStatus);
      }, 100);
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
    storeTimezoneCookie();
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
        // MODAL
        isCommandKOpen,
        setIsCommandKOpen,
        shareModalProps,
        setShareModalProps,
        // ADMIN
        userEmail,
        setUserEmail,
        isUserSignedIn,
        adminUpdateTimes,
        registerAdminUpdate,
        hiddenPhotosCount,
        selectedPhotoIds,
        setSelectedPhotoIds,
        isPerformingSelectEdit,
        setIsPerformingSelectEdit,
        insightIndicatorStatus,
        setInsightIndicatorStatus,
        // DEBUG
        isGridHighDensity,
        setIsGridHighDensity,
        areZoomControlsShown,
        setAreZoomControlsShown,
        arePhotosMatted,
        setArePhotosMatted,
        shouldDebugImageFallbacks,
        setShouldDebugImageFallbacks,
        shouldShowBaselineGrid,
        setShouldShowBaselineGrid,
        shouldDebugInsights,
        setShouldDebugInsights,
        shouldDebugRecipeOverlays,
        setShouldDebugRecipeOverlays,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
