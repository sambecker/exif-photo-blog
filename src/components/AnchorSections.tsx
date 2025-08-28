import useHash from '@/utility/useHash';
import useVisibility from '@/utility/useVisibility';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function AnchorSections({
  sections,
  className,
  classNameSection,
}: {
  sections: {
    id: string
    content: ReactNode
  }[]
  className?: string
  classNameSection?: string
}) {
  const { hash, updateHash } = useHash();

  const isAutoSelectDisabled = useRef(false);

  const firstSection = useMemo(() => sections[0].id, [sections]);

  // Highlight initial section
  useEffect(() => {
    updateHash(firstSection);
  }, [updateHash, firstSection]);

  // Disable auto-select for 100ms after hash
  useEffect(() => {
    isAutoSelectDisabled.current = true;
    const timeout = setTimeout(() => {
      isAutoSelectDisabled.current = false;
    }, 100);
    return () => clearTimeout(timeout);
  }, [hash]);

  // Reset section when scrolled to the top
  const _onScroll = useCallback(() => {
    if (window.scrollY <= 0) {
      updateHash(firstSection);
    }
  }, [updateHash, firstSection]);
  const onScroll = useDebouncedCallback(_onScroll, 100, { leading: true });
  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const onVisible = useCallback((section: string) => {
    if (!isAutoSelectDisabled.current) {
      updateHash(section);
    }
  }, [updateHash]);
  
  return (
    <div className={className}>
      {sections.map(({ id, content }) => (
        <AnchorSection
          key={id}
          id={id}
          className={classNameSection}
          onVisible={onVisible}
        >
          {content}
        </AnchorSection>
      ))}
    </div>
  );
}

function AnchorSection({
  id,
  children,
  onVisible: _onVisible,
  onHidden: _onHidden,
  className,
}: {
  id: string
  children: ReactNode
  onVisible?: (section: string, force?: boolean) => void
  onHidden?: (section: string, force?: boolean) => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onVisible = useCallback(() => _onVisible?.(id), [id, _onVisible]);
  const onHidden = useCallback(() =>  _onHidden?.(id), [id, _onHidden]);

  useVisibility({ ref, onVisible, onHidden });

  return (
    <div ref={ref} {...{ id, className }}>
      <a href={`#${id}`} />
      {children}
    </div>
  );
}
