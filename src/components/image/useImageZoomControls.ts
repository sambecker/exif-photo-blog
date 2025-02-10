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

  const viewerContainerRef = useRef<HTMLDivElement>(null);

  const { setShouldRespondToKeyboardCommands } = useAppState();

  const [zoomLevel, setZoomLevel] = useState(1);

  const [colorLight, setColorLight] = useState<string>();

  useMetaThemeColor({ colorLight });

  const open = useCallback(() => {
    viewerRef.current?.show();
  }, [viewerRef]);

  const close = useCallback(() => {
    viewerRef.current?.hide();
  }, [viewerRef]);

  const zoomTo = useCallback((zoomLevel = 1) => {
    viewerRef.current?.zoomTo(zoomLevel);
  }, [viewerRef]);

  const reset = useCallback(() => {
    setZoomLevel(1);
    viewerRef.current?.reset();
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
          image.loading = 'eager';
          return image.src;
        },
        show: () => {
          setShouldRespondToKeyboardCommands?.(false);
          setColorLight('#000');
        },
        hide: () => {
          setTimeout(() => {
            setColorLight(undefined);
          }, 300);
        },
        hidden: () => {
          setShouldRespondToKeyboardCommands?.(true);
        },
        zoom: ({ detail: { ratio } }) => {
          setZoomLevel(ratio);
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
    zoomTo,
    setShouldRespondToKeyboardCommands,
  ]);

  return {
    open,
    close,
    reset,
    zoomTo,
    zoomLevel,
    viewerContainerRef,
  };
}
