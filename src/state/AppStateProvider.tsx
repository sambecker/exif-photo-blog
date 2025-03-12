'use client';

import { useState, useEffect, ReactNode, useCallback, useRef } from 'react';
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
import { AdminData, getAdminDataAction } from '@/admin/actions';
import {
  storeAuthEmailCookie,
  clearAuthEmailCookie,
  hasAuthEmailCookie,
} from '@/auth/client';
import { useRouter, usePathname } from 'next/navigation';
import { isPathAdmin, PATH_SIGN_IN } from '@/app/paths';
import { INITIAL_UPLOAD_STATE, UploadState } from '@/admin/upload';
import { RecipeProps } from '@/recipe';

export default function AppStateProvider({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter();

  const pathname = usePathname();

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
  // UPLOAD
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, _setUploadState] =
    useState(INITIAL_UPLOAD_STATE);
  // MODAL
  const [isCommandKOpen, setIsCommandKOpen] =
    useState(false);
  const [shareModalProps, setShareModalProps] =
    useState<ShareModalProps>();
  const [recipeModalProps, setRecipeModalProps] =
    useState<RecipeProps>();
  // AUTH
  const [userEmail, setUserEmail] =
    useState<string>();
  const [isUserSignedInEager, setIsUserSignedInEager] =
    useState(false);
  // ADMIN
  const [adminUpdateTimes, setAdminUpdateTimes] =
    useState<Date[]>([]);
  const [selectedPhotoIds, setSelectedPhotoIds] =
    useState<string[] | undefined>();
  const [isPerformingSelectEdit, setIsPerformingSelectEdit] =
    useState(false);
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

  useEffect(() => {
    setHasLoaded?.(true);
    storeTimezoneCookie();
  }, []);

  const invalidateSwr = useCallback(() => setSwrTimestamp(Date.now()), []);

  const {
    data: auth,
    error: authError,
    isLoading: isCheckingAuth,
  } = useSWR('getAuth', getAuthAction);
  useEffect(() => {
    setIsUserSignedInEager(hasAuthEmailCookie());
    if (!authError) {
      setUserEmail(auth?.user?.email ?? undefined);
    }
  }, [auth, authError]);
  const isUserSignedIn = Boolean(userEmail);

  const { data: adminData, mutate: refreshAdminData } = useSWR(
    isUserSignedIn ? 'getAdminData' : null,
    getAdminDataAction,
  );
  const updateAdminData = useCallback(
    (updatedData: Partial<AdminData>) => {
      if (adminData) {
        refreshAdminData({
          ...adminData,
          ...updatedData,
        });
      }
    }, [adminData, refreshAdminData]);

  useEffect(() => {
    if (userEmail) {
      storeAuthEmailCookie(userEmail);
    }
  }, [userEmail, adminData]);

  const registerAdminUpdate = useCallback(() =>
    setAdminUpdateTimes(updates => [...updates, new Date()])
  , []);

  const clearAuthStateAndRedirect = useCallback(() => {
    setUserEmail(undefined);
    setIsUserSignedInEager(false);
    clearAuthEmailCookie();
    if (isPathAdmin(pathname)) { router.push(PATH_SIGN_IN); }
  }, [router, pathname]);

  const startUpload = useCallback((onStart?: () => void) => {
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
      uploadInputRef.current.click();
      uploadInputRef.current.oninput = onStart ?? null;
      uploadInputRef.current.oncancel = onStart ?? null;
    }
  }, []);
  const setUploadState = useCallback((uploadState: Partial<UploadState>) => {
    _setUploadState(prev => ({ ...prev, ...uploadState }));
  }, []);
  const resetUploadState = useCallback(() => {
    _setUploadState(INITIAL_UPLOAD_STATE);
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
        // UPLOAD
        uploadInputRef,
        startUpload,
        uploadState,
        setUploadState,
        resetUploadState,
        // MODAL
        isCommandKOpen,
        setIsCommandKOpen,
        shareModalProps,
        setShareModalProps,
        recipeModalProps,
        setRecipeModalProps,
        // AUTH
        isCheckingAuth,
        userEmail,
        setUserEmail,
        isUserSignedIn,
        isUserSignedInEager,
        clearAuthStateAndRedirect,
        // ADMIN
        adminUpdateTimes,
        registerAdminUpdate,
        refreshAdminData,
        updateAdminData,
        ...adminData,
        selectedPhotoIds,
        setSelectedPhotoIds,
        isPerformingSelectEdit,
        setIsPerformingSelectEdit,
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
