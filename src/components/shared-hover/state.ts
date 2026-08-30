import {
  ComponentProps,
  createContext,
  ReactNode,
  use,
} from 'react';
import ComponentSurface from '../primitives/surface/ComponentSurface';

export type SharedHoverProps = {
  key: string
  // Snapshot taken at hover time so visibility and content commit together
  content: ReactNode
  width: number
  height: number
  offsetAbove: number
  offsetBelow: number
  color?: ComponentProps<typeof ComponentSurface>['color']
}

export type SharedHoverState = {
  showHover?: (trigger: HTMLElement | null, hover: SharedHoverProps) => void
  // Applies late-arriving content, ignored once `key` is no longer showing
  renderHover?: (key: string, content: ReactNode) => void
  dismissHover?: (trigger: HTMLElement | null) => void
  isHoverBeingShown?: (key: string) => boolean
}

export const SharedHoverContext = createContext<SharedHoverState>({});

export const useSharedHoverState = () => use(SharedHoverContext);
