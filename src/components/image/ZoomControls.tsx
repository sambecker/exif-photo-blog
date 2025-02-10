import clsx from 'clsx/lite';
import { ReactNode, RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useImageZoomControls from './useImageZoomControls';
import { RiCollapseDiagonalLine, RiExpandDiagonalLine } from 'react-icons/ri';

export type ZoomControlsRef = {
  open: () => void
  zoom: (zoomLevel?: number) => void
}

export default function ZoomControls({
  ref,
  children,
  isEnabled,
  shouldZoomOnFKeydown,
}: {
  ref?: RefObject<ZoomControlsRef | null>
  children: ReactNode
  isEnabled?: boolean
  shouldZoomOnFKeydown?: boolean
}) {
  const refContainer = useRef<HTMLDivElement>(null);

  const { open, zoom, zoomLevel, isShown } = useImageZoomControls(
    refContainer,
    isEnabled,
    shouldZoomOnFKeydown,
  );

  useEffect(() => {
    if (ref) { ref.current = { open, zoom }; }
  }, [ref, open, zoom]);

  const shouldZoomTo2x = zoomLevel < 2;

  const button = 
    <button
      className={clsx(
        isShown ? 'inline-flex' : 'hidden',
        'fixed top-[20px] right-[70px] z-[100000]',
        'size-10 items-center justify-center',
        'rounded-full border-none',
        'text-white bg-black/50 hover:bg-black/85',
      )}
      onClick={() => zoom(shouldZoomTo2x ? 2 : 1)}
    >
      {shouldZoomTo2x
        ? <RiCollapseDiagonalLine className="shrink-0" size={20} />
        : <RiExpandDiagonalLine className="shrink-0" size={20} />}
    </button>;

  return (
    <div
      ref={refContainer}
      className={clsx('h-full', isEnabled && 'cursor-zoom-in')}
    >
      {children}
      {typeof window !== 'undefined'
        ? createPortal(button, document.body)
        : button}
    </div>
  );
}
