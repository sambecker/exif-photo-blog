import useMetaThemeColor from '@/site/useMetaThemeColor';
import { useAppState } from '@/state/AppState';
import useKeydownHandler from '@/utility/useKeydownHandler';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import Viewer from 'viewerjs';

export default function useImageZoomControls(
  imageRef: RefObject<HTMLDivElement | null>,
  isEnabled?: boolean,
  shouldExpandOnFKeydown?: boolean,
) {
  const viewerRef = useRef<Viewer | null>(null);

  const { setShouldRespondToKeyboardCommands } = useAppState();

  const [isShown, setIsShown] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [colorLight, setColorLight] = useState<string>();

  useMetaThemeColor({ colorLight });

  const open = useCallback(() => {
    viewerRef.current?.show();
  }, [viewerRef]);

  const close = useCallback(() => {
    viewerRef.current?.hide();
  }, [viewerRef]);

  const zoom = useCallback((zoomLevel = 1) => {
    viewerRef.current?.zoomTo(zoomLevel);
  }, [viewerRef]);

  // On 'F' keydown, toggle fullscreen
  const handleKeyDown = useCallback(() => {
    if (shouldExpandOnFKeydown) {
      viewerRef.current?.show();
    }
  }, [shouldExpandOnFKeydown]);
  useKeydownHandler(handleKeyDown, ['F']);

  useEffect(() => {
    if (imageRef.current && isEnabled) {
      const closeButton = document
        .getElementsByClassName('viewer-close')[0] as HTMLElement;
      viewerRef.current = new Viewer(imageRef.current, {
        navbar: false,
        title: false,
        toolbar: {
          zoomIn: 1,
          reset: 2,
          zoomOut: 3,
        },
        url: (image: HTMLImageElement) => {
          image.loading = 'eager';
          return image.src;
        },
        show: () => {
          setShouldRespondToKeyboardCommands?.(false);
          setColorLight('#000');
          setIsShown(true);
          if (closeButton) { closeButton.style.display = 'none'; }
        },
        hide: () => {
          setTimeout(() => {
            setColorLight(undefined);
            setIsShown(false);
          }, 300);
        },
        hidden: () => {
          setShouldRespondToKeyboardCommands?.(true);
        },
        zoom: ({ detail: { ratio } }) => {
          setZoomLevel(ratio);
        },
        view: () => {
          const container = document
            .getElementsByClassName('viewer-container')[0];
          if (container) {
            const closeButton = document
              .getElementsByClassName('viewer-close')[0] as HTMLElement;
            if (closeButton) { closeButton.style.display = 'inline-flex'; }
          }
        },
      });

      return () => {
        viewerRef.current?.destroy();
        viewerRef.current = null;
      };
    }
  }, [
    imageRef,
    isEnabled,
    zoom,
    setShouldRespondToKeyboardCommands,
  ]);

  return {
    open,
    close,
    zoom,
    zoomLevel,
    isShown,
  };
}
