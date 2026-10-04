'use client';

import {
  createContext,
  ReactNode,
  use,
  useCallback,
  useState,
} from 'react';

export interface StickyHeaderLevel {
  id: string
  element: HTMLElement
  height: number
  tracksNav: boolean
}

const StickyHeaderContext = createContext<{
  levels: StickyHeaderLevel[]
  updateLevel: (level: StickyHeaderLevel) => void
  removeLevel: (id: string) => void
}>({
  levels: [],
  updateLevel: () => {},
  removeLevel: () => {},
});

export const useStickyHeaderContext = () => use(StickyHeaderContext);

const sortByDocumentOrder = (a: StickyHeaderLevel, b: StickyHeaderLevel) =>
  a.element.compareDocumentPosition(b.element) &
    Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export default function StickyHeaderProvider({
  children,
}: {
  children: ReactNode
}) {
  const [levels, setLevels] = useState<StickyHeaderLevel[]>([]);

  const updateLevel = useCallback((level: StickyHeaderLevel) =>
    setLevels(current => {
      const existing = current.find(({ id }) => id === level.id);
      if (
        existing?.element === level.element &&
        existing.height === level.height &&
        existing.tracksNav === level.tracksNav
      ) {
        return current;
      }
      return current
        .filter(({ id }) => id !== level.id)
        .concat(level)
        .sort(sortByDocumentOrder);
    })
  , []);

  const removeLevel = useCallback((id: string) =>
    setLevels(current => current.filter(level => level.id !== id))
  , []);

  return (
    <StickyHeaderContext value={{ levels, updateLevel, removeLevel }}>
      {children}
    </StickyHeaderContext>
  );
}
