import { ComponentProps, createContext, ReactNode, use } from 'react';
import MenuSurface from '../primitives/MenuSurface';

export type Tooltip = {
  content: ReactNode
  width: number
  height: number
  offsetAbove: number
  offsetBelow: number
  color?: ComponentProps<typeof MenuSurface>['color']
}

export type OGTooltipState = {
  showTooltip?: (trigger: HTMLElement | null, tooltip: Tooltip) => void
  dismissTooltip?: (trigger: HTMLElement | null) => void
}

export const OGTooltipContext = createContext<OGTooltipState>({});

export const useOGTooltipState = () => use(OGTooltipContext);
