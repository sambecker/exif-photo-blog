import {
  ComponentProps,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  use,
} from 'react';
import ComponentSurface from '../primitives/surface/ComponentSurface';

export type SharedHoverProps = {
  key: string
  width: number
  height: number
  offsetAbove: number
  offsetBelow: number
  color?: ComponentProps<typeof ComponentSurface>['color']
}

export type SharedHoverState = {
  showHover?: (trigger: HTMLElement | null, hover: SharedHoverProps) => void
  renderHover?: Dispatch<SetStateAction<ReactNode>>
  dismissHover?: (trigger: HTMLElement | null) => void
  isHoverBeingShown?: (key: string) => boolean
}

export const SharedHoverContext = createContext<SharedHoverState>({});

export const useSharedHoverState = () => use(SharedHoverContext);
