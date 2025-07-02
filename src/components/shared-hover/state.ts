import { ComponentProps, createContext, ReactNode, use } from 'react';
import MenuSurface from '../primitives/MenuSurface';

export type SharedHoverData = {
  key: string
  content: ReactNode
  className?: string
  width: number
  height: number
  offsetAbove: number
  offsetBelow: number
  color?: ComponentProps<typeof MenuSurface>['color']
}

export type SharedHoverState = {
  currentHoverKey?: string
  showHover?: (trigger: HTMLElement | null, hover: SharedHoverData) => void
  dismissHover?: (trigger: HTMLElement | null) => void
}

export const SharedHoverContext = createContext<SharedHoverState>({});

export const useSharedHoverState = () => use(SharedHoverContext);
