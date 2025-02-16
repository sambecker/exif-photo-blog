import useMetaThemeColor from '@/utility/useMetaThemeColor';
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

  const viewerContainerRef = useRef<HTMLDivElement>(null);

  const { setShouldRespondToKeyboardCommands } = useAppState();

  const [zoomLevel, setZoomLevel] = useState(1);

  const [colorLight, setColorLight] = useState<string>();

  useMetaThemeColor({ colorLight });

  const open = useCallback(() =>
    viewerRef.current?.show(), []);

  const close = useCallback(() =>
    viewerRef.current?.hide(), []);

  const zoomTo = useCallback((zoomLevel = 1) =>
    viewerRef.current?.zoomTo(zoomLevel), []);

  const reset = useCallback(() => {
    setZoomLevel(1);
    viewerRef.current?.reset();
  }, []);

  // On 'F' keydown, toggle fullscreen
  const handleKeyDown = useCallback(() => {
    if (shouldExpandOnFKeydown) { open(); }
  }, [shouldExpandOnFKeydown, open]);
  useKeydownHandler(handleKeyDown, ['F']);

  const initialize = useCallback(() => {
    if (imageRef.current && isEnabled) {
      viewerRef.current = new Viewer(imageRef.current, {
        navbar: false,
        title: false,
        toolbar: {
          zoomIn: 1,
          reset: 2,
          zoomOut: 3,
        },
        ready: ({ target }) => {
          viewerContainerRef.current =
            (target as any).viewer.viewer as HTMLDivElement;
        },
        url: (image: HTMLImageElement) => {
          // Addresses Safari bug where images don't load
          image.loading = 'eager';
          return image.src;
        },
        show: () => {
          setShouldRespondToKeyboardCommands?.(false);
          setColorLight('#000');
        },
        hide: () => {
          // Optimizes Safari status bar animation
          setTimeout(() => setColorLight(undefined), 300);
        },
        hidden: () => {
          setShouldRespondToKeyboardCommands?.(true);
        },
        zoom: ({ detail: { ratio } }) => {
          setZoomLevel(ratio);
        },
      });
    }
  }, [
    imageRef,
    isEnabled,
    setShouldRespondToKeyboardCommands,
  ]);

  const cleanUp = useCallback(() => {
    viewerRef.current?.destroy();
    viewerRef.current = null;
  }, []);

  useEffect(() => {
    initialize();
    return cleanUp;
  }, [initialize, cleanUp]);

  return {
    initialize,
    cleanUp,
    open,
    close,
    reset,
    zoomTo,
    zoomLevel,
    viewerContainerRef,
  };
}
