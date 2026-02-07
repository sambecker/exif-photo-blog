'use client';

import {
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { AppStateContext } from '../app/AppState';
import { AnimationConfig } from '@/components/AnimateItems';
import { getAuthAction } from '@/auth/actions';
import useSWR, { useSWRConfig } from 'swr';
import {
  HIGH_DENSITY_GRID,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  MATTE_PHOTOS,
  SHOW_ZOOM_CONTROLS,
} from '@/app/config';
import { ShareModalProps } from '@/share';
import { storeTimezoneCookie } from '@/utility/timezone';
import { AdminData, getAdminDataAction } from '@/admin/actions';
import {
  storeAuthEmailCookie,
  clearAuthEmailCookie,
  getAuthEmailCookie,
} from '@/auth';
import { useRouter, usePathname } from 'next/navigation';
import { isPathProtected, PATH_ROOT } from '@/app/path';
import { INITIAL_UPLOAD_STATE, UploadState } from '@/admin/upload';
import { RecipeProps } from '@/recipe';
import { nanoid } from 'nanoid';
import { toastSuccess } from '@/toast';
import { getCountsForCategoriesCachedAction } from '@/category/actions';
import {
  canKeyBePurged,
  canKeyBePurgedAndRevalidated,
  SWR_KEYS,
  SWRKey,
} from '@/swr';
import { warmRedisAction } from './actions';
import useSupportsHover from '@/utility/useSupportsHover';

export default function AppStateProvider({
  children,
  areAdminDebugToolsEnabled,
}: {
  children: ReactNode
  areAdminDebugToolsEnabled?: boolean
}) {
  const router = useRouter();

  const pathname = usePathname();

  // CORE
  const [hasLoadedWithAnimations, setHasLoadedWithAnimations] =
    useState(false);
  const [nextPhotoAnimation, _setNextPhotoAnimation] =
    useState<AnimationConfig>();
  const [nextPhotoAnimationId, setNextPhotoAnimationId] =
    useState<string>();
  const setNextPhotoAnimation = useCallback((animation?: AnimationConfig) => {
    _setNextPhotoAnimation(animation);
    setNextPhotoAnimationId(undefined);
  }, []);
  const getNextPhotoAnimationId = useCallback(() => {
    const id = nanoid();
    setNextPhotoAnimationId(id);
    return id;
  }, []);
  const clearNextPhotoAnimation = useCallback((id?: string) => {
    if (id === nextPhotoAnimationId) {
      setNextPhotoAnimation(undefined);
      setNextPhotoAnimationId(undefined);
    }
  }, [nextPhotoAnimationId, setNextPhotoAnimation]);
  const [shouldRespondToKeyboardCommands, setShouldRespondToKeyboardCommands] =
    useState(true);
  // ENVIRONMENT
  const [timezone, setTimezone] = useState<string>();
  const supportsHover = useSupportsHover();
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
  const [userEmailEager, setUserEmailEager] =
    useState<string>();
  const isUserSignedIn = Boolean(userEmail);
  const isUserSignedInEager = Boolean(userEmailEager);
  // ADMIN
  const [adminUpdateTimes, setAdminUpdateTimes] =
    useState<Date[]>([]);
  // UPLOAD
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, _setUploadState] = useState(INITIAL_UPLOAD_STATE);
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
    storeTimezoneCookie();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserEmailEager(getAuthEmailCookie());
    // Capture backup timezone on client
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (IS_PRODUCTION) { warmRedisAction(); }
    const timeout = setTimeout(() => {
      setHasLoadedWithAnimations(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const { mutate } = useSWRConfig();
  const invalidateSwr = useCallback((key?: SWRKey, revalidate?: boolean) => {
    if (key) {
      // Mutate specific key
      mutate((k: string) => k?.startsWith(key), undefined, { revalidate });
    } else {
      // Mutate all keys that can be purged
      mutate(canKeyBePurged, undefined, { revalidate: false });
      mutate(canKeyBePurgedAndRevalidated, undefined, { revalidate: true });
    }
  }, [mutate]);

  const { data: categoriesWithCounts } = useSWR(
    SWR_KEYS.GET_COUNTS_FOR_CATEGORIES,
    getCountsForCategoriesCachedAction,
  );

  const {
    data: auth,
    error: authError,
    isLoading: isCheckingAuth,
  } = useSWR(SWR_KEYS.GET_AUTH, getAuthAction);
  useEffect(() => {
    if (auth === null || authError) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserEmail(undefined);
      setUserEmailEager(undefined);
      clearAuthEmailCookie();
    } else {
      setUserEmail(auth?.user?.email ?? undefined);
    }
  }, [auth, authError]);

  const {
    data: adminData,
    mutate: refreshAdminData,
    isLoading: isLoadingAdminData,
  } = useSWR(
    isUserSignedIn ? SWR_KEYS.GET_ADMIN_DATA : null,
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
  }, [userEmail]);

  const registerAdminUpdate = useCallback(() =>
    setAdminUpdateTimes(updates => [...updates, new Date()])
  , []);

  const clearAuthStateAndRedirectIfNecessary = useCallback(() => {
    setUserEmail(undefined);
    setUserEmailEager(undefined);
    clearAuthEmailCookie();
    if (isPathProtected(pathname)) {
      router.push(PATH_ROOT);
    } else {
      toastSuccess('Signed out');
    }
  }, [router, pathname]);

  // Returns false when upload is cancelled
  const startUpload = useCallback(() => new Promise<boolean>(resolve => {
    if (uploadInputRef.current) {
      uploadInputRef.current.value = '';
      uploadInputRef.current.click();
      uploadInputRef.current.oninput = () => resolve(true);
      uploadInputRef.current.oncancel = () => resolve(false);
    } else {
      resolve(false);
    }
  })
  , []);
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
        hasLoadedWithAnimations,
        invalidateSwr,
        nextPhotoAnimation,
        setNextPhotoAnimation,
        getNextPhotoAnimationId,
        clearNextPhotoAnimation,
        shouldRespondToKeyboardCommands,
        setShouldRespondToKeyboardCommands,
        categoriesWithCounts,
        // ENVIRONMENT
        timezone,
        supportsHover,
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
        userEmailEager,
        setUserEmail,
        isUserSignedIn,
        isUserSignedInEager,
        clearAuthStateAndRedirectIfNecessary,
        // ADMIN
        adminUpdateTimes,
        registerAdminUpdate,
        ...adminData,
        hasAdminData: Boolean(adminData),
        isLoadingAdminData,
        refreshAdminData,
        updateAdminData,
        // UPLOAD
        uploadInputRef,
        startUpload,
        uploadState,
        setUploadState,
        resetUploadState,
        // DEBUG
        areAdminDebugToolsEnabled,
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
