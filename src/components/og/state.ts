import { createContext, ReactNode, MouseEvent, use } from 'react';

export type OGTooltipState = {
  onMouseEnter?: (e: MouseEvent<HTMLElement>, tooltip: ReactNode) => void
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void
}

export const OGTooltipContext = createContext<OGTooltipState>({});

export const useOGTooltipState = () => use(OGTooltipContext);
