import { createContext, ReactNode, use } from 'react';

export type OGTooltipState = {
  showTooltip?: (element: HTMLElement | null, tooltip: ReactNode) => void
  dismissTooltip?: (element: HTMLElement | null) => void
}

export const OGTooltipContext = createContext<OGTooltipState>({});

export const useOGTooltipState = () => use(OGTooltipContext);
