import { RefObject, useEffect, useRef } from 'react';
import Viewer from 'viewerjs';

export default function useImageZoomControls(
  imageRef: RefObject<HTMLDivElement | null>,
  isEnabled?: boolean,
) {
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (imageRef.current && isEnabled) {
      viewerRef.current = new Viewer(imageRef.current, {
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
  }, [imageRef, isEnabled]);
}
