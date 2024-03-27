import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { AnimationConfig } from '@/components/AnimateItems';

export interface AppStateContext {
  previousPathname?: string
  hasLoaded?: boolean
  setHasLoaded?: Dispatch<SetStateAction<boolean>>
  nextPhotoAnimation?: AnimationConfig
  setNextPhotoAnimation?: Dispatch<SetStateAction<AnimationConfig | undefined>>
  shouldRespondToKeyboardCommands?: boolean
  setShouldRespondToKeyboardCommands?: Dispatch<SetStateAction<boolean>>
  isCommandKOpen?: boolean
  setIsCommandKOpen?: Dispatch<SetStateAction<boolean>>
  shouldShowBaselineGrid?: boolean
  setShouldShowBaselineGrid?: Dispatch<SetStateAction<boolean>>
  clearNextPhotoAnimation?: () => void
}

export const AppStateContext = createContext<AppStateContext>({});

export const useAppState = () => useContext(AppStateContext);
