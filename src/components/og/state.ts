import { createContext, ReactNode, use } from 'react';

export type Tooltip = {
  content: ReactNode
  width: number
  height: number
  offsetAbove: number
  offsetBelow: number
}

export type OGTooltipState = {
  showTooltip?: (trigger: HTMLElement | null, tooltip: Tooltip) => void
  dismissTooltip?: (trigger: HTMLElement | null) => void
}

export const OGTooltipContext = createContext<OGTooltipState>({});

export const useOGTooltipState = () => use(OGTooltipContext);
