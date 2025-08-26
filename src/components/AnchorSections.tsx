import useHash from '@/utility/useHash';
import useVisibility from '@/utility/useVisibility';
import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';

export default function AnchorSections({
  sectionIds,
  sectionContent,
  className,
  classNameSection,
}: {
  sectionIds: string[]
  sectionContent: ReactNode[]
  className?: string
  classNameSection?: string
}) {
  const { hash, updateHash } = useHash();

  const isAutoSelectDisabled = useRef(false);

  // Highlight initial section
  useEffect(() => {
    updateHash(sectionIds[0]);
  }, [updateHash, sectionIds]);

  // Disable auto-select for 100ms after hash
  useEffect(() => {
    isAutoSelectDisabled.current = true;
    const timeout = setTimeout(() => {
      isAutoSelectDisabled.current = false;
    }, 100);
    return () => clearTimeout(timeout);
  }, [hash]);

  // Reset section when scrolled to the top
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY <= 0) {
        updateHash(sectionIds[0]);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [updateHash, sectionIds]);

  const onVisible = useCallback((section: string) => {
    if (!isAutoSelectDisabled.current) {
      updateHash(section);
    }
  }, [updateHash]);
  
  return (
    <div className={className}>
      {sectionIds.map((id, index) => (
        <AnchorSection
          key={id}
          id={id}
          className={classNameSection}
          onVisible={onVisible}
        >
          {sectionContent[index]}
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
