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
  // setCurrentSection,
  className,
  classNameSection,
}: {
  sectionIds: string[]
  sectionContent: ReactNode[]
  // setCurrentSection: Dispatch<SetStateAction<string>>
  className?: string
  classNameSection?: string
}) {
  const { hash } = useHash();

  const isAutoSelectDisabled = useRef(true);

  // Disable auto-select for 500ms after page load
  useEffect(() => {
    const timeout = setTimeout(() => {
      isAutoSelectDisabled.current = false;
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Disable auto-select for 500ms after page navigation
  useEffect(() => {
    isAutoSelectDisabled.current = true;
    const timeout = setTimeout(() => {
      isAutoSelectDisabled.current = false;
    }, 500);
    return () => clearTimeout(timeout);
  }, [hash]);

  const onVisible = useCallback((section: string) => {
    if (!isAutoSelectDisabled.current) {
      window.location.hash = section;
    }
  }, []);
  
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
  onVisible?: (section: string) => void
  onHidden?: (section: string) => void
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onVisible = useCallback(() => _onVisible?.(id), [id, _onVisible]);
  const onHidden = useCallback(() => _onHidden?.(id), [id, _onHidden]);
  useVisibility({ ref, onVisible, onHidden });
  return (
    <div ref={ref} {...{ id, className }}>
      <a href={`#${id}`} />
      {children}
    </div>
  );
}
