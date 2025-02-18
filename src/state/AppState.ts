import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { AnimationConfig } from '@/components/AnimateItems';
import { ShareModalProps } from '@/share';
import { InsightIndicatorStatus } from '@/admin/insights';

export interface AppStateContext {
  // CORE
  previousPathname?: string
  hasLoaded?: boolean
  setHasLoaded?: Dispatch<SetStateAction<boolean>>
  swrTimestamp?: number
  invalidateSwr?: () => void
  nextPhotoAnimation?: AnimationConfig
  setNextPhotoAnimation?: Dispatch<SetStateAction<AnimationConfig | undefined>>
  clearNextPhotoAnimation?: () => void
  shouldRespondToKeyboardCommands?: boolean
  setShouldRespondToKeyboardCommands?: Dispatch<SetStateAction<boolean>>
  // MODAL
  isCommandKOpen?: boolean
  setIsCommandKOpen?: Dispatch<SetStateAction<boolean>>
  shareModalProps?: ShareModalProps
  setShareModalProps?: Dispatch<SetStateAction<ShareModalProps | undefined>>
  // ADMIN
  userEmail?: string
  setUserEmail?: Dispatch<SetStateAction<string | undefined>>
  isUserSignedIn?: boolean
  adminUpdateTimes?: Date[]
  registerAdminUpdate?: () => void
  hiddenPhotosCount?: number
  selectedPhotoIds?: string[]
  setSelectedPhotoIds?: Dispatch<SetStateAction<string[] | undefined>>
  isPerformingSelectEdit?: boolean
  setIsPerformingSelectEdit?: Dispatch<SetStateAction<boolean>>
  insightIndicatorStatus?: InsightIndicatorStatus
  setInsightIndicatorStatus?: Dispatch<SetStateAction<InsightIndicatorStatus>>
  // DEBUG
  isGridHighDensity?: boolean
  setIsGridHighDensity?: Dispatch<SetStateAction<boolean>>
  areZoomControlsShown?: boolean
  setAreZoomControlsShown?: Dispatch<SetStateAction<boolean>>
  arePhotosMatted?: boolean
  setArePhotosMatted?: Dispatch<SetStateAction<boolean>>
  shouldDebugImageFallbacks?: boolean
  setShouldDebugImageFallbacks?: Dispatch<SetStateAction<boolean>>
  shouldShowBaselineGrid?: boolean
  setShouldShowBaselineGrid?: Dispatch<SetStateAction<boolean>>
  shouldDebugInsights?: boolean
  setShouldDebugInsights?: Dispatch<SetStateAction<boolean>>
}

export const AppStateContext = createContext<AppStateContext>({});

export const useAppState = () => useContext(AppStateContext);
