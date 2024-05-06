import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { AnimationConfig } from '@/components/AnimateItems';

export interface AppStateContext {
  previousPathname?: string
  hasLoaded?: boolean
  swrTimestamp?: number
  invalidateSwr?: () => void
  userEmail?: string
  setUserEmail?: Dispatch<SetStateAction<string | undefined>>
  isUserSignedIn?: boolean
  setHasLoaded?: Dispatch<SetStateAction<boolean>>
  nextPhotoAnimation?: AnimationConfig
  setNextPhotoAnimation?: Dispatch<SetStateAction<AnimationConfig | undefined>>
  shouldRespondToKeyboardCommands?: boolean
  setShouldRespondToKeyboardCommands?: Dispatch<SetStateAction<boolean>>
  isCommandKOpen?: boolean
  setIsCommandKOpen?: Dispatch<SetStateAction<boolean>>
  adminUpdateTimes?: Date[]
  registerAdminUpdate?: () => void
  shouldShowBaselineGrid?: boolean
  setShouldShowBaselineGrid?: Dispatch<SetStateAction<boolean>>
  shouldDebugBlur?: boolean
  setShouldDebugBlur?: Dispatch<SetStateAction<boolean>>
  clearNextPhotoAnimation?: () => void
}

export const AppStateContext = createContext<AppStateContext>({});

export const useAppState = () => useContext(AppStateContext);
