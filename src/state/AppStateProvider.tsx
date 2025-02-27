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
import { ShareModalProps } from '@/share';
import { storeTimezoneCookie } from '@/utility/timezone';
import { InsightIndicatorStatus } from '@/admin/insights';
import { getAdminDataAction } from '@/admin/actions';
import {
  storeAuthEmailCookie,
  clearAuthEmailCookie,
  hasAuthEmailCookie,
} from '@/auth/client';
import { useRouter } from 'next/navigation';
import { PATH_SIGN_IN } from '@/app/paths';

export default function AppStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const { previousPathname } = usePathnames();

  const router = useRouter();

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
  const [isUserSignedInEager, setIsUserSignedInEager] =
    useState(false);
  // ADMIN
  const [adminUpdateTimes, setAdminUpdateTimes] =
    useState<Date[]>([]);
  const [photosCount, setPhotosCount] =
    useState<number>();
  const [photosCountHidden, setPhotosCountHidden] =
    useState<number>();
  const [uploadsCount, setUploadsCount] =
    useState<number>();
  const [tagsCount, setTagsCount] =
    useState<number>();
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

  const { data: auth, error: authError } = useSWR('getAuth', getAuthAction);
  useEffect(() => {
    setIsUserSignedInEager(hasAuthEmailCookie());
    if (!authError) {
      setUserEmail(auth?.user?.email ?? undefined);
    }
  }, [auth, authError]);
  const isUserSignedIn = Boolean(userEmail);

  const {
    data: adminData,
    error: adminError,
    mutate: refreshAdminData,
  } = useSWR(
    isUserSignedIn ? 'getAdminData' : null,
    getAdminDataAction, {
      refreshInterval: 1000 * 60,
    },
  );

  useEffect(() => {
    if (userEmail) {
      storeAuthEmailCookie(userEmail);
      if (adminData) {
        const timeout = setTimeout(() => {
          setPhotosCount(adminData.countPhotos);
          setPhotosCountHidden(adminData.countHiddenPhotos);
          setUploadsCount(adminData.countUploads);
          setTagsCount(adminData.countTags);
          setInsightIndicatorStatus(adminData.shouldShowInsightsIndicator);
        }, 100);
        return () => clearTimeout(timeout);
      }
    } else {
      setPhotosCountHidden(0);
    }
  }, [adminData, adminError, userEmail]);

  const registerAdminUpdate = useCallback(() =>
    setAdminUpdateTimes(updates => [...updates, new Date()])
  , []);

  useEffect(() => {
    setHasLoaded?.(true);
    storeTimezoneCookie();
  }, []);

  const clearAuthStateAndRedirect = useCallback((shouldRedirect = true) => {
    setUserEmail(undefined);
    clearAuthEmailCookie();
    if (shouldRedirect) { router.push(PATH_SIGN_IN); }
  }, [router]);

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
        // AUTH
        userEmail,
        setUserEmail,
        isUserSignedIn,
        isUserSignedInEager,
        clearAuthStateAndRedirect,
        // ADMIN
        adminUpdateTimes,
        registerAdminUpdate,
        refreshAdminData,
        photosCount,
        photosCountHidden,
        uploadsCount,
        tagsCount,
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
