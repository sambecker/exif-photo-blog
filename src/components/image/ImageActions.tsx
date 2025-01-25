import { useEffect, useRef } from 'react';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { clsx } from 'clsx/lite';
import FullscreenButton from '../FullscreenButton';

export default function ImageActions({ children, enableImageActions = false, className }: { children: React.ReactNode, enableImageActions?: boolean, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (containerRef.current && enableImageActions) {
      viewerRef.current = new Viewer(containerRef.current, {
        inline: false,
        button: true,
        navbar: false,
        title: false,
        toolbar: {
          zoomIn: 1,
          zoomOut: 1,
          reset: 1,
          tooltip: 1,
        },
      });
      return () => {
        viewerRef.current?.destroy();
      };
    }
  }, [enableImageActions]);

  return (
    <>
      <style jsx global>{`
        .viewer-canvas {
          background-color: black !important;
        }
        .viewer-reset::before {
          content: '1:1';
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          display: inline-block;
          position: relative;
          bottom: -9px;
          letter-spacing: -2px;
          background-image: none;
        }
      `}</style>
      <div className={clsx(className, enableImageActions && 'cursor-zoom-in')} ref={containerRef} >
        {children}
        {enableImageActions && <FullscreenButton imageRef={containerRef}/>}
      </div>
    </>
  );
}
